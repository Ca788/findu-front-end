import { AppStorage } from '@/infrastructure/storage/AppStorage';

interface StoredValue<T> {
  value: T;
  expiresAt?: number;
}

export class MemoryStorage implements AppStorage {
  private store: Record<string, StoredValue<unknown>> = {};

  get<T>(key: string): T | undefined {
    const stored = this.store[key];
    if (!stored) return undefined;

    if (stored.expiresAt && Date.now() > stored.expiresAt) {
      this.remove(key);
      return undefined;
    }
    return stored.value as T;
  }

  set<T>(key: string, value: T, ttlInMinutes?: number): void {
    const expiresAt = ttlInMinutes ? Date.now() + ttlInMinutes * 60 * 1000 : undefined;
    this.store[key] = { value, expiresAt };
  }

  remove(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}
