import { AxiosHeaders, type AxiosResponse } from 'axios';
import { Capacitor } from '@capacitor/core';
import publicApiClient from '@/infrastructure/public-api.client';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';
import { disconnectCable } from '@/infrastructure/cable.client';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import type { SuccessResponse } from '@/infrastructure/AppResponse';

export const CLIENT_PLATFORM_HEADER = 'X-Client-Platform';

export interface SessionTokens {
  accessToken: string;
  refreshToken?: string;
}

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let refreshInFlight: Promise<string | null> | null = null;

export function getClientPlatform(): string {
  return Capacitor.getPlatform();
}

export function getAccessToken(): string | null {
  return appStorage.get<string>(AppStorageKeys.TOKEN) ?? null;
}

export function getRefreshToken(): string | null {
  return appStorage.get<string>(AppStorageKeys.REFRESH_TOKEN) ?? null;
}

export function setSession(tokens: SessionTokens): void {
  appStorage.set(AppStorageKeys.TOKEN, stripBearer(tokens.accessToken));
  if (tokens.refreshToken) {
    appStorage.set(AppStorageKeys.REFRESH_TOKEN, tokens.refreshToken);
  }
}

export function clearSession(): void {
  appStorage.remove(AppStorageKeys.TOKEN);
  appStorage.remove(AppStorageKeys.REFRESH_TOKEN);
  disconnectCable();
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized(): void {
  clearSession();
  unauthorizedHandler?.();
}

export function readAuthorizationHeader(response: AxiosResponse): string | undefined {
  const headers = response.headers;

  if (headers instanceof AxiosHeaders) {
    const value = headers.get('authorization');
    return typeof value === 'string' ? value : undefined;
  }

  const plain = headers as Record<string, unknown>;
  const value = plain['authorization'] ?? plain['Authorization'];
  return typeof value === 'string' ? value : undefined;
}

export function persistSessionFromResponse(
  response: AxiosResponse<SuccessResponse<{ refresh_token?: string }>>,
): string | undefined {
  const headerValue = readAuthorizationHeader(response);
  if (!headerValue) return undefined;

  const accessToken = stripBearer(headerValue);
  setSession({ accessToken, refreshToken: response.data?.data?.refresh_token });
  return accessToken;
}

export function refreshSession(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.resolve(null);

  refreshInFlight = publicApiClient
    .post<SuccessResponse<{ refresh_token: string }>>(
      '/token/refresh',
      { refresh_token: refreshToken },
      { headers: { [CLIENT_PLATFORM_HEADER]: getClientPlatform() } },
    )
    .then((response) => persistSessionFromResponse(response) ?? null)
    .catch(() => null)
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

function stripBearer(value: string): string {
  return value.startsWith('Bearer ') ? value.slice('Bearer '.length) : value;
}
