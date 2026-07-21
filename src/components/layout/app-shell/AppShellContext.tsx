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
import { useKeyboardInset } from '@/hooks/useKeyboardInset';

interface AppShellContextValue {
  isDesktop: boolean;
  collapsed: boolean;
  drawerOpen: boolean;
  recentOpen: boolean;
  keyboardOpen: boolean;
  keyboardInset: number;
  toggleCollapsed: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openRecent: () => void;
  closeRecent: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const { isDesktop } = useDevice();
  const { inset: keyboardInset, isOpen: keyboardOpen } = useKeyboardInset();
  const [collapsed, setCollapsed] = usePersistedBoolean(
    AppStorageKeys.SIDEBAR_COLLAPSED,
    false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);

  const toggleCollapsed = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed],
  );
  const openDrawer = useCallback(() => setMobileOpen(true), []);
  const closeDrawer = useCallback(() => setMobileOpen(false), []);
  const openRecent = useCallback(() => setRecentOpen(true), []);
  const closeRecent = useCallback(() => setRecentOpen(false), []);

  const value = useMemo<AppShellContextValue>(
    () => ({
      isDesktop,
      collapsed,
      drawerOpen: !isDesktop && mobileOpen,
      recentOpen,
      keyboardOpen,
      keyboardInset,
      toggleCollapsed,
      openDrawer,
      closeDrawer,
      openRecent,
      closeRecent,
    }),
    [
      isDesktop,
      collapsed,
      mobileOpen,
      recentOpen,
      keyboardOpen,
      keyboardInset,
      toggleCollapsed,
      openDrawer,
      closeDrawer,
      openRecent,
      closeRecent,
    ],
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
