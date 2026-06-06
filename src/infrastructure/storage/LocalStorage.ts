import { AppStorage } from '@/infrastructure/storage/AppStorage';

interface StoredItem<T> {
  value: T;
  expiration: number | null;
}

export class LocalStorage implements AppStorage {
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  get<T>(key: string): T | undefined {
    if (!this.isLocalStorageAvailable()) return undefined;

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return undefined;

      const parsedItem = JSON.parse(item) as StoredItem<T>;
      if (parsedItem.expiration && Date.now() > parsedItem.expiration) {
        this.remove(key);
        return undefined;
      }

      return parsedItem.value;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage`, error);
      return undefined;
    }
  }

  set<T>(key: string, value: T, ttlInMinutes?: number): void {
    if (!this.isLocalStorageAvailable()) return;

    try {
      const item: StoredItem<T> = {
        value,
        expiration: ttlInMinutes ? Date.now() + ttlInMinutes * 60_000 : null,
      };
      window.localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage`, error);
    }
  }

  remove(key: string): void {
    if (!this.isLocalStorageAvailable()) return;

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage`, error);
    }
  }

  clear(): void {
    if (!this.isLocalStorageAvailable()) return;

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
}
