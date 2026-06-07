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
  UpdateProfileInput,
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
    disconnectCable();
  }
}

export async function getCurrentUser(): Promise<User> {
  const response = await authorizedApiClient.get<SuccessResponse<AuthResponseData>>(
    '/user',
  );
  return response.data.data.user;
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const hasAvatar = input.avatar instanceof File;
  const isRemovingAvatar = input.removeAvatar === true;

  if (!hasAvatar) {
    const payload: Record<string, unknown> = {};
    if (typeof input.name !== 'undefined') payload.name = input.name;
    if (typeof input.phone !== 'undefined') payload.phone = input.phone;
    if (isRemovingAvatar) payload.remove_avatar = true;

    const response = await authorizedApiClient.patch<SuccessResponse<AuthResponseData>>(
      '/user',
      { user: payload },
    );
    return response.data.data.user;
  }

  const formData = new FormData();
  if (typeof input.name !== 'undefined') formData.append('user[name]', input.name ?? '');
  if (typeof input.phone !== 'undefined') formData.append('user[phone]', input.phone ?? '');
  if (input.avatar) formData.append('user[avatar]', input.avatar);
  if (isRemovingAvatar) formData.append('user[remove_avatar]', 'true');

  const response = await authorizedApiClient.patch<SuccessResponse<AuthResponseData>>(
    '/user',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
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
