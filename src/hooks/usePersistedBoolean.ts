'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';

export function usePersistedBoolean(
  key: string,
  fallback: boolean,
): readonly [boolean, (next: boolean) => void] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handler = (event: StorageEvent) => {
        if (event.key === key) onStoreChange();
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    const stored = appStorage.get<boolean>(key);
    return typeof stored === 'boolean' ? stored : fallback;
  }, [key, fallback]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: boolean) => {
      appStorage.set(key, next);
      window.dispatchEvent(new StorageEvent('storage', { key }));
    },
    [key],
  );

  return [value, setValue] as const;
}
