'use client';

import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import { UserMenu } from '@/features/auth/components/userMenu/UserMenu';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';
import { useDevice } from '@/hooks/useDevice';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

function isChatRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === AppRoutePaths.CHAT ||
    pathname.startsWith(`${AppRoutePaths.CHAT}/`)
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const { isDesktop, openDrawer, openRecent } = useAppShell();
  const { isMobile } = useDevice();
  const chatRoute = isChatRoute(pathname);
  const showMenuButton = !isDesktop && !isMobile && !chatRoute;
  const showRecentButton = chatRoute;

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-1 border-b border-(--mui-palette-divider) bg-(--mui-palette-background-default)/85 px-3 backdrop-blur md:px-4"
      style={{
        height: 'var(--app-header-height)',
        paddingTop: 'var(--app-safe-top)',
      }}
    >
      {showRecentButton && (
        <Tooltip title="Recentes">
          <IconButton
            onClick={openRecent}
            aria-label="Abrir recentes"
            edge="start"
            size="medium"
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      )}

      {showMenuButton && (
        <Tooltip title="Abrir menu">
          <IconButton
            onClick={openDrawer}
            aria-label="Abrir menu"
            edge="start"
            size="medium"
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      )}

      <Box sx={{ flex: 1, minWidth: 0 }} />

      <ThemeToggleButton />
      <UserMenu />
    </header>
  );
}
