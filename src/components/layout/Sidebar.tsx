'use client';

import Drawer from '@mui/material/Drawer';
import { SidebarContent } from '@/components/layout/SidebarContent';

export const SIDEBAR_WIDTH = 256;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function Sidebar({ open, onClose, onToggle }: SidebarProps) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH },
        }}
      >
        <SidebarContent onSelect={onClose} onToggle={onClose} />
      </Drawer>

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <SidebarContent onSelect={() => undefined} onToggle={onToggle} />
      </Drawer>
    </>
  );
}
