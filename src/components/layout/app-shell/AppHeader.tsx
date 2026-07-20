'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import { UserMenu } from '@/features/auth/components/userMenu/UserMenu';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';
import { useDevice } from '@/hooks/useDevice';

export function AppHeader() {
  const title = usePageTitle();
  const { isDesktop, openDrawer } = useAppShell();
  const { isMobile } = useDevice();
  const showMenuButton = !isDesktop && !isMobile;

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-1 border-b border-(--mui-palette-divider) bg-(--mui-palette-background-default)/85 px-3 backdrop-blur md:px-4"
      style={{
        height: 'var(--app-header-height)',
        paddingTop: 'var(--app-safe-top)',
      }}
    >
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

      <Typography
        variant="subtitle1"
        component="h1"
        className="flex-1 truncate font-semibold tracking-tight"
        sx={{
          pl: isMobile ? 0.5 : 0.5,
          fontSize: { xs: '1.15rem', sm: '1.05rem' },
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </Typography>

      <ThemeToggleButton />
      <UserMenu />
    </header>
  );
}
