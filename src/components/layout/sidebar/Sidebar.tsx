'use client';

import Drawer from '@mui/material/Drawer';
import { useSidebar } from '@/contexts/SidebarContext';
import { SidebarContent } from '@/components/layout/sidebar/SidebarContent';
import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_MOBILE_WIDTH,
} from '@/components/layout/sidebar/constants';

export function Sidebar() {
  const { isDesktop, collapsed, mobileOpen, closeMobile } = useSidebar();

  if (!isDesktop) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_MOBILE_WIDTH,
            maxWidth: SIDEBAR_EXPANDED_WIDTH,
          },
        }}
      >
        <SidebarContent
          collapsed={false}
          onNavigate={closeMobile}
          onClose={closeMobile}
        />
      </Drawer>
    );
  }

  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

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
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <SidebarContent collapsed={collapsed} />
    </Drawer>
  );
}
