import publicApiClient from '@/infrastructure/public-api.client';
import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { SuccessResponse } from '@/infrastructure/AppResponse';
import {
  CLIENT_PLATFORM_HEADER,
  clearSession,
  getClientPlatform,
  getRefreshToken,
  persistSessionFromResponse,
} from '@/infrastructure/session';
import type {
  AuthResponseData,
  ForgotPasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
  UpdateProfileInput,
} from '@/features/auth/models/auth.model';
import type { User } from '@/models/user.model';

const platformHeaders = () => ({ [CLIENT_PLATFORM_HEADER]: getClientPlatform() });

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await publicApiClient.post<SuccessResponse<AuthResponseData>>(
    '/login',
    { user: credentials },
    { headers: platformHeaders() },
  );
  persistSessionFromResponse(response);
  return response.data.data.user;
}

export async function register(credentials: RegisterCredentials): Promise<User> {
  const { passwordConfirmation, ...rest } = credentials;
  const response = await publicApiClient.post<SuccessResponse<AuthResponseData>>(
    '/user',
    { user: { ...rest, password_confirmation: passwordConfirmation } },
    { headers: platformHeaders() },
  );
  persistSessionFromResponse(response);
  return response.data.data.user;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    await authorizedApiClient.delete('/logout', {
      data: refreshToken ? { refresh_token: refreshToken } : undefined,
      skipAuthHandler: true,
    });
  } finally {
    clearSession();
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
