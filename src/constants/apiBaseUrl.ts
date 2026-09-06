const AZURE_API_BASE_URL =
  'https://findu-web.yellowcoast-21752100.westus2.azurecontainerapps.io/api/v1';

export function resolveApiBaseUrl(raw: string | undefined): string {
  const value = raw?.trim() ?? '';
  if (!value || value.includes('findu-api.fly.dev')) {
    return AZURE_API_BASE_URL;
  }
  return value;
}

export const API_BASE_URL = resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
