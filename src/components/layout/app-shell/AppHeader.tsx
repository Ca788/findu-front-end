'use client';

import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import { UserMenu } from '@/features/auth/components/userMenu/UserMenu';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import { sectionTitle } from '@/components/layout/app-shell/appNavItems';
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';
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
  const { isDesktop, openRecent } = useAppShell();
  const chatRoute = isChatRoute(pathname);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-2 border-b border-(--mui-palette-divider) bg-(--mui-palette-background-default)/85 px-4 backdrop-blur md:px-6"
      style={{
        height: 'var(--app-header-height)',
        paddingTop: 'var(--app-safe-top)',
      }}
    >
      {chatRoute && (
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

      {isDesktop && (
        <Typography
          component="p"
          sx={{
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {sectionTitle(pathname ?? '')}
        </Typography>
      )}

      <Box sx={{ flex: 1, minWidth: 0 }} />

      <ThemeToggleButton />
      <UserMenu />
    </header>
  );
}
