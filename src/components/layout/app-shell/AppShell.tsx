'use client';

import { ReactNode, useEffect } from 'react';
import Box from '@mui/material/Box';
import {
  AppShellProvider,
  useAppShell,
} from '@/components/layout/app-shell/AppShellContext';
import { AppDrawer } from '@/components/layout/app-shell/AppDrawer';
import { AppHeader } from '@/components/layout/app-shell/AppHeader';
import { AppBottomNav } from '@/components/layout/app-shell/AppBottomNav';
import { RecentConversationsDrawer } from '@/features/chat/components/conversations/RecentConversationsDrawer';

interface AppShellProps {
  children: ReactNode;
}

function AppShellLayout({ children }: AppShellProps) {
  const { recentOpen, closeRecent, keyboardOpen, keyboardInset } = useAppShell();

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--keyboard-inset',
      `${keyboardInset}px`,
    );
    document.documentElement.dataset.keyboard = keyboardOpen ? 'open' : 'closed';
  }, [keyboardInset, keyboardOpen]);

  return (
    <Box
      sx={{
        height: keyboardOpen
          ? `calc(100dvh - ${keyboardInset}px)`
          : '100dvh',
        bgcolor: 'background.default',
        display: 'flex',
        overflow: 'hidden',
        transition: 'height 120ms linear',
      }}
    >
      <AppDrawer />
      <RecentConversationsDrawer open={recentOpen} onClose={closeRecent} />
      <Box
        component="div"
        sx={{
          position: 'relative',
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <AppHeader />
        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
        <AppBottomNav />
      </Box>
    </Box>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AppShellProvider>
      <AppShellLayout>{children}</AppShellLayout>
    </AppShellProvider>
  );
}
