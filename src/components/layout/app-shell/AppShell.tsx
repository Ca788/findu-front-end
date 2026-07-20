'use client';

import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { AppShellProvider } from '@/components/layout/app-shell/AppShellContext';
import { AppDrawer } from '@/components/layout/app-shell/AppDrawer';
import { AppHeader } from '@/components/layout/app-shell/AppHeader';
import { AppBottomNav } from '@/components/layout/app-shell/AppBottomNav';

interface AppShellProps {
  children: ReactNode;
}

function AppShellLayout({ children }: AppShellProps) {
  return (
    <Box
      sx={{
        height: '100dvh',
        bgcolor: 'background.default',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <AppDrawer />
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
