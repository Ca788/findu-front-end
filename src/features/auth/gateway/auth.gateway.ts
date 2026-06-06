import type { AxiosResponse } from 'axios';
import publicApiClient from '@/infrastructure/public-api.client';
import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { SuccessResponse } from '@/infrastructure/AppResponse';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import type {
  AuthResponseData,
  LoginCredentials,
  RegisterCredentials,
} from '@/features/auth/models/auth.model';
import type { User } from '@/models/user.model';

function extractAndPersistToken(response: AxiosResponse): void {
  const headerValue =
    (response.headers['authorization'] as string | undefined) ??
    (response.headers['Authorization'] as string | undefined);

  if (!headerValue) return;

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
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await authorizedApiClient.get<SuccessResponse<AuthResponseData>>(
    '/user',
  );
  return response.data.data.user;
}
