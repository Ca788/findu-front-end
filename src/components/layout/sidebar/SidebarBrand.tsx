'use client';

import Image from 'next/image';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface SidebarBrandProps {
  collapsed: boolean;
  onClose?: () => void;
}

export function SidebarBrand({ collapsed, onClose }: SidebarBrandProps) {
  return (
    <Box
      className={`flex h-16 items-center gap-2 px-3 ${collapsed ? 'justify-center' : ''}`}
    >
      <Image
        src="/logo.png"
        alt="Findu"
        width={36}
        height={30}
        priority
        className="h-8 w-auto"
      />
      {!collapsed && (
        <Typography
          variant="h6"
          component="span"
          className="font-semibold tracking-tight"
        >
          Findu
        </Typography>
      )}
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
