export interface AppStorage {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttlInMinutes?: number): void;
  remove(key: string): void;
  clear(): void;
}
