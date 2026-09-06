import { createConsumer, type Consumer } from '@rails/actioncable';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import { API_BASE_URL } from '@/constants/apiBaseUrl';

let consumer: Consumer | null = null;
let activeToken: string | null = null;

function buildCableUrl(token: string): string {
  const base = API_BASE_URL;
  const url = new URL(base, 'http://localhost');
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = '/cable';
  url.search = `?token=${encodeURIComponent(token)}`;
  url.hash = '';
  return url.toString();
}

export function getCableConsumer(): Consumer | null {
  if (typeof window === 'undefined') return null;

  const token = appStorage.get<string>(AppStorageKeys.TOKEN);
  if (!token) return null;

  if (consumer && activeToken === token) return consumer;

  consumer?.disconnect();
  consumer = createConsumer(buildCableUrl(token));
  activeToken = token;
  return consumer;
}

export function disconnectCable(): void {
  consumer?.disconnect();
  consumer = null;
  activeToken = null;
}
