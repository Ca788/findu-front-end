'use client';

import NextLink from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import type { NavItem } from '@/components/layout/sidebar/navItems';

interface SidebarItemProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onSelect?: () => void;
  onComingSoon: (label: string) => void;
}

export function SidebarItem({
  item,
  active,
  collapsed,
  onSelect,
  onComingSoon,
}: SidebarItemProps) {
  const Icon = item.icon;
  const isComingSoon = !!item.comingSoon;

  const handleClick = () => {
    if (isComingSoon) onComingSoon(item.label);
    onSelect?.();
  };

  const buttonProps = isComingSoon
    ? { onClick: handleClick }
    : { component: NextLink, href: item.href, onClick: handleClick };

  return (
    <ListItem disablePadding className="mb-1">
      <Tooltip
        title={item.label}
        placement="right"
        disableHoverListener={!collapsed}
        disableFocusListener={!collapsed}
        disableTouchListener={!collapsed}
      >
        <ListItemButton
          selected={active}
          aria-label={item.label}
          className="rounded-xl"
          sx={{
            minHeight: 44,
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 1.5 : 2,
          }}
          {...buttonProps}
        >
          <ListItemIcon
            sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}
          >
            <Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            aria-hidden={collapsed}
            sx={{ display: collapsed ? 'none' : 'block' }}
          />
          {!collapsed && isComingSoon && (
            <Chip label="Em breve" size="small" variant="outlined" />
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}
