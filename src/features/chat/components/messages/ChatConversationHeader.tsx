'use client';

import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';
import { APP_CHAT_HISTORY_PATH } from '@/components/layout/app-shell/appNavItems';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

interface ChatConversationHeaderProps {
  title: string;
}

export function ChatConversationHeader({ title }: ChatConversationHeaderProps) {
  return (
    <header className="flex items-center gap-1.5">
      <Tooltip title="Histórico de conversas">
        <IconButton
          component={Link}
          href={APP_CHAT_HISTORY_PATH}
          aria-label="Histórico de conversas"
          size="small"
        >
          <HistoryIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Typography
        variant="subtitle2"
        component="h1"
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
