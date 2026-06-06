'use client';

import { forwardRef, MouseEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

interface UserAvatarButtonProps {
  initials: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  expanded: boolean;
  controls?: string;
}

export const UserAvatarButton = forwardRef<HTMLButtonElement, UserAvatarButtonProps>(
  function UserAvatarButton({ initials, onClick, expanded, controls }, ref) {
    return (
      <Tooltip title="Conta">
        <IconButton
          ref={ref}
          onClick={onClick}
          size="small"
          aria-controls={expanded ? controls : undefined}
          aria-haspopup="true"
          aria-expanded={expanded ? 'true' : undefined}
        >
          <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>
            {initials}
          </Avatar>
        </IconButton>
      </Tooltip>
    );
  },
);
