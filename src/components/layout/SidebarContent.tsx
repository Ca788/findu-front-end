'use client';

import { usePathname } from 'next/navigation';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { navItems, type NavItem } from '@/components/layout/navItems';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { SidebarBrand } from '@/components/layout/SidebarBrand';
import { SidebarItem } from '@/components/layout/SidebarItem';

interface SidebarContentProps {
  onSelect: () => void;
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.comingSoon) return false;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function SidebarContent({ onSelect }: SidebarContentProps) {
  const pathname = usePathname();
  const { showInfo } = useSnackbar();

  const handleComingSoon = (label: string) => showInfo(`${label} — em breve`);

  return (
    <div className="flex h-full flex-col">
      <SidebarBrand />
      <Divider />
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <List disablePadding>
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              active={isActive(pathname, item)}
              onSelect={onSelect}
              onComingSoon={handleComingSoon}
            />
          ))}
        </List>
      </nav>
    </div>
  );
}
