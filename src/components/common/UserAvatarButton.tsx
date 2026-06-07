'use client';

import { forwardRef, MouseEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { absoluteApiUrl } from '@/utils/url';

interface UserAvatarButtonProps {
  initials: string;
  avatarUrl?: string | null;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  expanded: boolean;
  controls?: string;
}

export const UserAvatarButton = forwardRef<HTMLButtonElement, UserAvatarButtonProps>(
  function UserAvatarButton({ initials, avatarUrl, onClick, expanded, controls }, ref) {
    const src = avatarUrl ? absoluteApiUrl(avatarUrl) : undefined;

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
          <Avatar src={src} sx={{ width: 36, height: 36, fontSize: 14 }}>
            {initials}
          </Avatar>
        </IconButton>
      </Tooltip>
    );
  },
);
