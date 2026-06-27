'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import { useDevice } from '@/hooks/useDevice';
import { usePersistedBoolean } from '@/hooks/usePersistedBoolean';

interface AppShellContextValue {
  isDesktop: boolean;
  collapsed: boolean;
  drawerOpen: boolean;
  toggleCollapsed: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const { isDesktop } = useDevice();
  const [collapsed, setCollapsed] = usePersistedBoolean(
    AppStorageKeys.SIDEBAR_COLLAPSED,
    false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed],
  );
  const openDrawer = useCallback(() => setMobileOpen(true), []);
  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  const value = useMemo<AppShellContextValue>(
    () => ({
      isDesktop,
      collapsed,
      drawerOpen: !isDesktop && mobileOpen,
      toggleCollapsed,
      openDrawer,
      closeDrawer,
    }),
    [isDesktop, collapsed, mobileOpen, toggleCollapsed, openDrawer, closeDrawer],
  );

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell(): AppShellContextValue {
  const ctx = useContext(AppShellContext);
  if (!ctx) {
    throw new Error('useAppShell must be used within an AppShellProvider');
  }
  return ctx;
}
