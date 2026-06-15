'use client';

import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
} from '@/components/layout/sidebar/constants';
import { Topbar } from '@/components/layout/Topbar';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { FloatingAgentProvider } from '@/contexts/FloatingAgentContext';
import { FloatingAgentLauncher } from '@/features/chat/floating/FloatingAgentLauncher';
import { FloatingAgentPanel } from '@/features/chat/floating/FloatingAgentPanel';

interface ProtectedShellProps {
  children: ReactNode;
}

function ProtectedShellLayout({ children }: ProtectedShellProps) {
  const { isDesktop, collapsed } = useSidebar();

  const contentOffset = !isDesktop
    ? 0
    : collapsed
      ? SIDEBAR_COLLAPSED_WIDTH
      : SIDEBAR_EXPANDED_WIDTH;

  return (
    <Box className="min-h-screen">
      <Sidebar />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pl: `${contentOffset}px`,
          transition: (theme) =>
            theme.transitions.create('padding-left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </Box>
      <FloatingAgentPanel />
      <FloatingAgentLauncher />
    </Box>
  );
}

export function ProtectedShell({ children }: ProtectedShellProps) {
  return (
    <SidebarProvider>
      <FloatingAgentProvider>
        <ProtectedShellLayout>{children}</ProtectedShellLayout>
      </FloatingAgentProvider>
    </SidebarProvider>
  );
}
