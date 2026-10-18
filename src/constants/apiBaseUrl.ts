const DEFAULT_API_BASE_URL = 'http://localhost:3000/api/v1';

export function resolveApiBaseUrl(raw: string | undefined): string {
  const value = raw?.trim() ?? '';
  return value || DEFAULT_API_BASE_URL;
}

export const API_BASE_URL = resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
