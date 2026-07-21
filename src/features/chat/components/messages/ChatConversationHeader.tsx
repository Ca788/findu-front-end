'use client';

import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/AddOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

interface ChatConversationHeaderProps {
  title: string;
}

export function ChatConversationHeader({ title }: ChatConversationHeaderProps) {
  return (
    <header className="flex items-center gap-1.5">
      <Typography
        variant="subtitle2"
        component="h2"
        sx={{
          flex: 1,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </Typography>
      <Tooltip title="Nova conversa">
        <IconButton
          component={Link}
          href={AppRoutePaths.CHAT}
          aria-label="Nova conversa"
          size="small"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </header>
  );
}
