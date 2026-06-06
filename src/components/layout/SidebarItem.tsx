'use client';

import NextLink from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import type { NavItem } from '@/components/layout/navItems';

interface SidebarItemProps {
  item: NavItem;
  active: boolean;
  onSelect: () => void;
  onComingSoon: (label: string) => void;
}

export function SidebarItem({ item, active, onSelect, onComingSoon }: SidebarItemProps) {
  const Icon = item.icon;
  const isComingSoon = !!item.comingSoon;

  const handleClick = () => {
    if (isComingSoon) onComingSoon(item.label);
    onSelect();
  };

  const buttonProps = isComingSoon
    ? { onClick: handleClick }
    : { component: NextLink, href: item.href, onClick: handleClick };

  return (
    <ListItem disablePadding className="mb-1">
      <ListItemButton selected={active} className="rounded-xl" {...buttonProps}>
        <ListItemIcon>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={item.label} />
        {isComingSoon && <Chip label="Em breve" size="small" variant="outlined" />}
      </ListItemButton>
    </ListItem>
  );
}
