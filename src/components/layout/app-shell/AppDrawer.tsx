'use client';

import Drawer from '@mui/material/Drawer';
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';
import { AppDrawerContent } from '@/components/layout/app-shell/AppDrawerContent';
import {
  APP_DRAWER_COLLAPSED_WIDTH,
  APP_DRAWER_EXPANDED_WIDTH,
  APP_DRAWER_MOBILE_WIDTH,
} from '@/components/layout/app-shell/constants';

export function AppDrawer() {
  const { isDesktop, collapsed, drawerOpen, closeDrawer } = useAppShell();

  if (!isDesktop) {
    return (
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={closeDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: APP_DRAWER_MOBILE_WIDTH,
            maxWidth: 360,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <AppDrawerContent
          collapsed={false}
          onNavigate={closeDrawer}
          onClose={closeDrawer}
        />
      </Drawer>
    );
  }

  const width = collapsed ? APP_DRAWER_COLLAPSED_WIDTH : APP_DRAWER_EXPANDED_WIDTH;

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shorter,
            }),
        },
      }}
    >
      <AppDrawerContent collapsed={collapsed} />
    </Drawer>
  );
}
