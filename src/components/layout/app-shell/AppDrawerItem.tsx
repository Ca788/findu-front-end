'use client';

import NextLink from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import type { AppNavItem } from '@/components/layout/app-shell/appNavItems';

interface AppDrawerItemProps {
  item: AppNavItem;
  active: boolean;
  collapsed: boolean;
  onSelect?: () => void;
}

export function AppDrawerItem({ item, active, collapsed, onSelect }: AppDrawerItemProps) {
  const Icon = item.icon;

  return (
    <ListItem disablePadding sx={{ mb: 0.25 }}>
      <Tooltip
        title={item.label}
        placement="right"
        disableHoverListener={!collapsed}
        disableFocusListener={!collapsed}
        disableTouchListener={!collapsed}
      >
        <ListItemButton
          component={NextLink}
          href={item.href}
          selected={active}
          onClick={onSelect}
          aria-label={item.label}
          sx={{
            minHeight: 44,
            borderRadius: 999,
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 1.5 : 2,
            mx: collapsed ? 0.5 : 1,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? 0 : 1.75,
              justifyContent: 'center',
              color: active ? 'primary.main' : 'text.secondary',
            }}
          >
            <Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            aria-hidden={collapsed}
            slotProps={{
              primary: {
                sx: { fontSize: 14, fontWeight: active ? 600 : 500 },
              },
            }}
            sx={{ display: collapsed ? 'none' : 'block', my: 0 }}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}
