import { AxiosHeaders, type AxiosResponse } from 'axios';
import publicApiClient from '@/infrastructure/public-api.client';
import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { SuccessResponse } from '@/infrastructure/AppResponse';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import { disconnectCable } from '@/infrastructure/cable.client';
import type {
  AuthResponseData,
  ForgotPasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from '@/features/auth/models/auth.model';
import type { User } from '@/models/user.model';

function readAuthorizationHeader(response: AxiosResponse): string | undefined {
  const headers = response.headers;

  if (headers instanceof AxiosHeaders) {
    const value = headers.get('authorization');
    return typeof value === 'string' ? value : undefined;
  }

  const plain = headers as Record<string, unknown>;
  const value = plain['authorization'] ?? plain['Authorization'];
  return typeof value === 'string' ? value : undefined;
}

function extractAndPersistToken(response: AxiosResponse): void {
  const headerValue = readAuthorizationHeader(response);

  if (!headerValue) {
    console.warn(
      '[auth] Authorization header not found in response. ' +
        'The backend must expose it via CORS ' +
        '(Rails rack-cors: `expose: ["Authorization"]`).',
    );
    return;
  }

  const token = headerValue.startsWith('Bearer ')
    ? headerValue.slice('Bearer '.length)
    : headerValue;

  appStorage.set(AppStorageKeys.TOKEN, token);
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await publicApiClient.post<SuccessResponse<AuthResponseData>>(
    '/login',
    { user: credentials },
  );
  extractAndPersistToken(response);
  return response.data.data.user;
}

export async function register(credentials: RegisterCredentials): Promise<User> {
  const { passwordConfirmation, ...rest } = credentials;
  const response = await publicApiClient.post<SuccessResponse<AuthResponseData>>(
    '/user',
    { user: { ...rest, password_confirmation: passwordConfirmation } },
  );
  extractAndPersistToken(response);
  return response.data.data.user;
}

export async function logout(): Promise<void> {
  try {
    await authorizedApiClient.delete('/logout');
  } finally {
    appStorage.remove(AppStorageKeys.TOKEN);
    disconnectCable();
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await authorizedApiClient.get<SuccessResponse<AuthResponseData>>(
    '/user',
  );
  return response.data.data.user;
}

export async function requestPasswordReset(
  credentials: ForgotPasswordCredentials,
): Promise<void> {
  await publicApiClient.post('/password', { user: credentials });
}

export async function resetPassword(
  credentials: ResetPasswordCredentials,
): Promise<void> {
  const { resetPasswordToken, password, passwordConfirmation } = credentials;
  await publicApiClient.patch('/password', {
    user: {
      reset_password_token: resetPasswordToken,
      password,
      password_confirmation: passwordConfirmation,
    },
  });
}
