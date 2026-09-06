import { API_BASE_URL } from '@/constants/apiBaseUrl';

export function absoluteApiUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//.test(url)) return url;
  const base = API_BASE_URL;
  try {
    const apiBase = new URL(base, 'http://localhost');
    return new URL(url, `${apiBase.protocol}//${apiBase.host}`).toString();
  } catch {
    return url;
  }
}
