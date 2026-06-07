'use client';

import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { navItems, type NavItem } from '@/components/layout/sidebar/navItems';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { SidebarBrand } from '@/components/layout/sidebar/SidebarBrand';
import { SidebarItem } from '@/components/layout/sidebar/SidebarItem';
import { SidebarToggle } from '@/components/layout/sidebar/SidebarToggle';

interface SidebarContentProps {
  collapsed: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.comingSoon) return false;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function SidebarContent({
  collapsed,
  onNavigate,
  onClose,
}: SidebarContentProps) {
  const pathname = usePathname();
  const { showInfo } = useSnackbar();

  const handleComingSoon = (label: string) => showInfo(`${label} — em breve`);

  return (
    <Box className="flex h-full flex-col">
      <SidebarBrand collapsed={collapsed} onClose={onClose} />
      <Divider />
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <List disablePadding>
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={isActive(pathname, item)}
              onSelect={onNavigate}
              onComingSoon={handleComingSoon}
            />
          ))}
        </List>
      </nav>
      <SidebarToggle />
    </Box>
  );
}
