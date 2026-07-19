'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/AddOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRightRounded';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';
import { AppDrawerBrand } from '@/components/layout/app-shell/AppDrawerBrand';
import { AppDrawerItem } from '@/components/layout/app-shell/AppDrawerItem';
import {
  appNavItems,
  findActiveNavItem,
  type AppNavItem,
} from '@/components/layout/app-shell/appNavItems';

interface AppDrawerContentProps {
  collapsed: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
}

function filterSection(section: AppNavItem['section']) {
  return appNavItems.filter((item) => (item.section ?? 'secondary') === section);
}

export function AppDrawerContent({ collapsed, onNavigate, onClose }: AppDrawerContentProps) {
  const pathname = usePathname() ?? '';
  const { isDesktop, toggleCollapsed } = useAppShell();
  const active = findActiveNavItem(pathname);

  const primaryItems = filterSection('primary');
  const secondaryItems = filterSection('secondary');

  return (
    <Box className="flex h-full flex-col">
      <AppDrawerBrand collapsed={collapsed} onClose={onClose} />
      <Divider />

      <Box sx={{ px: collapsed ? 1 : 2, pt: 2, pb: 1 }}>
        {collapsed ? (
          <Tooltip title="Nova conversa" placement="right">
            <IconButton
              component={NextLink}
              href={AppRoutePaths.CHAT}
              onClick={onNavigate}
              color="primary"
              aria-label="Nova conversa"
              sx={{
                width: 48,
                height: 48,
                mx: 'auto',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            component={NextLink}
            href={AppRoutePaths.CHAT}
            onClick={onNavigate}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              width: '100%',
              justifyContent: 'flex-start',
              fontWeight: 600,
              py: 1.25,
            }}
          >
            Nova conversa
          </Button>
        )}
      </Box>

      <nav className="flex-1 overflow-y-auto findu-scroll-smooth px-1 pb-3">
        <List disablePadding>
          {primaryItems.map((item) => (
            <AppDrawerItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={active?.href === item.href}
              onSelect={onNavigate}
            />
          ))}
        </List>

        {secondaryItems.length > 0 && (
          <>
            {!collapsed && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  px: 3,
                  pt: 2,
                  pb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontSize: 11,
                }}
              >
                Finanças
              </Typography>
            )}
            {collapsed && <Divider sx={{ my: 1, mx: 'auto', width: 32 }} />}
            <List disablePadding>
              {secondaryItems.map((item) => (
                <AppDrawerItem
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  active={active?.href === item.href}
                  onSelect={onNavigate}
                />
              ))}
            </List>
          </>
        )}
      </nav>

      {isDesktop && (
        <>
          <Divider />
          <Box className={`flex p-2 ${collapsed ? 'justify-center' : 'justify-end'}`}>
            <Tooltip
              title={collapsed ? 'Expandir menu' : 'Recolher menu'}
              placement="right"
            >
              <IconButton
                onClick={toggleCollapsed}
                aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
                size="small"
              >
                {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Box>
  );
}
