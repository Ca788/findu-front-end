'use client';

import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuOpenIcon from '@mui/icons-material/MenuOpenRounded';

interface SidebarBrandProps {
  onToggle?: () => void;
}

export function SidebarBrand({ onToggle }: SidebarBrandProps) {
  return (
    <div className="flex h-16 items-center gap-2 px-3 justify-between">
      <div className="flex h-16 items-center gap-2 px-3 cursor-pointer">
        <Image
            src="/logo.png"
            alt="Findu"
            width={36}
            height={30}
            priority
            className="h-8 w-auto"
        />
        <Typography
            variant="h6"
            component="span"
            className="font-semibold tracking-tight"
        >
          Findu
        </Typography>
      </div>
      {onToggle && (
          <Tooltip title="Fechar menu">
            <IconButton
                onClick={onToggle}
                aria-label="Fechar menu"
                size="small"
                edge="start"
            >
              <MenuOpenIcon />
            </IconButton>
          </Tooltip>
      )}
    </div>
  );
}
