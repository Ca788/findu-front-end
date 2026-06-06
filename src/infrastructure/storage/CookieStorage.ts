import { AppStorage } from '@/infrastructure/storage/AppStorage';

interface StoredItem<T> {
  value: T;
  expiration: number | null;
}

export class CookieStorage implements AppStorage {
  private isCookieAvailable(): boolean {
    return typeof document !== 'undefined';
  }

  get<T>(key: string): T | undefined {
    if (!this.isCookieAvailable()) return undefined;

    try {
      const name = `${key}=`;
      const cookies = document.cookie.split(';');

      for (const raw of cookies) {
        const cookie = raw.trim();
        if (!cookie.startsWith(name)) continue;

        const cookieValue = cookie.substring(name.length);
        const parsedItem = JSON.parse(decodeURIComponent(cookieValue)) as StoredItem<T>;

        if (parsedItem.expiration && Date.now() > parsedItem.expiration) {
          this.remove(key);
          return undefined;
        }
        return parsedItem.value;
      }
    } catch (error) {
      console.error(`Error retrieving ${key} from cookies`, error);
    }

    return undefined;
  }

  set<T>(key: string, value: T, ttlInMinutes?: number): void {
    if (!this.isCookieAvailable()) return;

    try {
      const expiration = ttlInMinutes ? Date.now() + ttlInMinutes * 60_000 : null;
      const item: StoredItem<T> = { value, expiration };
      const encoded = encodeURIComponent(JSON.stringify(item));
      const expires = expiration ? `;expires=${new Date(expiration).toUTCString()}` : '';
      document.cookie = `${key}=${encoded}${expires};path=/`;
    } catch (error) {
      console.error(`Error saving ${key} to cookies`, error);
    }
  }

  remove(key: string): void {
    if (!this.isCookieAvailable()) return;

    try {
      document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    } catch (error) {
      console.error(`Error removing ${key} from cookies`, error);
    }
  }

  clear(): void {
    if (!this.isCookieAvailable()) return;

    try {
      const cookies = document.cookie.split(';');
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      });
    } catch (error) {
      console.error('Error clearing cookies', error);
    }
  }
}
