'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import Link from 'next/link';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { UserMenu } from '@/features/auth/components/userMenu/UserMenu';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';

export function AppHeader() {
  const title = usePageTitle();
  const { isDesktop, openDrawer } = useAppShell();

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-1 border-b border-(--mui-palette-divider) bg-(--mui-palette-background-default)/85 px-2 backdrop-blur md:px-4"
      style={{
        height: 'var(--app-header-height)',
        paddingTop: 'var(--app-safe-top)',
      }}
    >
      {!isDesktop && (
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
        className="flex-1 truncate font-medium tracking-tight"
        sx={{ pl: isDesktop ? 0.5 : 0.5 }}
      >
        {title}
      </Typography>

      {!isDesktop && (
        <Tooltip title="Nova conversa">
          <IconButton
            component={Link}
            href={AppRoutePaths.CHAT}
            aria-label="Nova conversa"
            size="medium"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <ThemeToggleButton />
      <UserMenu />
    </header>
  );
}
