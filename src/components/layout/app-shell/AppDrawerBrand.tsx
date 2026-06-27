'use client';

import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

interface AppDrawerBrandProps {
  collapsed: boolean;
  onClose?: () => void;
}

export function AppDrawerBrand({ collapsed, onClose }: AppDrawerBrandProps) {
  return (
    <Box
      className={`flex items-center gap-2 px-3 ${collapsed ? 'justify-center' : ''}`}
      sx={{ height: 'var(--app-header-height)', flexShrink: 0 }}
    >
      <Link href={AppRoutePaths.CHAT} className="flex items-center gap-2 no-underline text-inherit">
        <Image
          src="/logo.webp"
          alt="Findu"
          width={32}
          height={32}
          priority
          className="h-8 w-8 rounded-md object-contain"
        />
        {!collapsed && (
          <Typography
            variant="subtitle1"
            component="span"
            sx={{ fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            Findu
          </Typography>
        )}
      </Link>
      {onClose && (
        <Tooltip title="Fechar menu">
          <IconButton
            onClick={onClose}
            aria-label="Fechar menu"
            size="small"
            className="ml-auto"
          >
            <CloseRoundedIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
