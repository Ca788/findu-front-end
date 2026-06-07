'use client';

import { ReactNode, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Sidebar, SIDEBAR_WIDTH } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useDevice } from '@/hooks/useDevice';

interface ProtectedShellProps {
  children: ReactNode;
}

export function ProtectedShell({ children }: ProtectedShellProps) {
  const { isDesktop } = useDevice();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(isDesktop);
  }, [isDesktop]);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  const showMenuButton = !open || !isDesktop;

  return (
    <div className="min-h-screen">
      <Sidebar
        open={open}
        onClose={handleClose}
        onToggle={handleToggle}
      />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pl: { xs: 0, md: open ? `${SIDEBAR_WIDTH}px` : 0 },
          transition: (theme) =>
            theme.transitions.create('padding-left', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Topbar onMenuClick={handleToggle} showMenuButton={showMenuButton} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </Box>
    </div>
  );
}
