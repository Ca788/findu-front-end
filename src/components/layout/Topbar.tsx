'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import { UserMenu } from '@/features/auth/components/userMenu/UserMenu';
import { usePageTitle } from '@/hooks/usePageTitle';

interface TopbarProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
}

export function Topbar({ onMenuClick, showMenuButton }: TopbarProps) {
  const title = usePageTitle();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-(--mui-palette-divider) bg-(--mui-palette-background-default)/80 px-4 backdrop-blur md:px-6">
      {showMenuButton && (
        <Tooltip title="Abrir menu">
          <IconButton
            onClick={onMenuClick}
            aria-label="Abrir menu"
            edge="start"
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      )}
      <Typography
        variant="subtitle1"
        component="h1"
        className="flex-1 font-medium tracking-tight"
      >
        {title}
      </Typography>
      <UserMenu />
    </header>
  );
}
