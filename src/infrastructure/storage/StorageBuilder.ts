import { AppStorage } from '@/infrastructure/storage/AppStorage';
import { MemoryStorage } from '@/infrastructure/storage/MemoryStorage';
import { LocalStorage } from '@/infrastructure/storage/LocalStorage';
import { CookieStorage } from '@/infrastructure/storage/CookieStorage';

class StorageAggregator implements AppStorage {
  private readonly storages: AppStorage[];

  constructor(storages: AppStorage[]) {
    this.storages = storages;
  }

  get<T>(key: string): T | undefined {
    for (const storage of this.storages) {
      const value = storage.get<T>(key);
      if (value !== undefined) return value;
    }
    return undefined;
  }

  set<T>(key: string, value: T, ttlInMinutes?: number): void {
    for (const storage of this.storages) {
      storage.set(key, value, ttlInMinutes);
    }
  }

  remove(key: string): void {
    for (const storage of this.storages) {
      storage.remove(key);
    }
  }

  clear(): void {
    for (const storage of this.storages) {
      storage.clear();
    }
  }
}

class StorageBuilder {
  private storages: AppStorage[] = [];

  useMemoryStorage(): StorageBuilder {
    this.storages.push(new MemoryStorage());
    return this;
  }

  useLocalStorage(): StorageBuilder {
    this.storages.push(new LocalStorage());
    return this;
  }

  useCookieStorage(): StorageBuilder {
    this.storages.push(new CookieStorage());
    return this;
  }

  build(): AppStorage {
    return new StorageAggregator(this.storages);
  }
}

export const appStorage: AppStorage = new StorageBuilder()
  .useMemoryStorage()
  .useLocalStorage()
  // .useCookieStorage()
  .build();
