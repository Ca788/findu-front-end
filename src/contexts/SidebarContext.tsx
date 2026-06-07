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

interface SidebarContextValue {
  isDesktop: boolean;
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
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
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const value = useMemo<SidebarContextValue>(
    () => ({
      isDesktop,
      collapsed,
      mobileOpen: !isDesktop && mobileOpen,
      toggleCollapsed,
      openMobile,
      closeMobile,
    }),
    [isDesktop, collapsed, mobileOpen, toggleCollapsed, openMobile, closeMobile],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
