'use client';

import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

interface ChatConversationHeaderProps {
  title: string;
}

export function ChatConversationHeader({ title }: ChatConversationHeaderProps) {
  return (
    <header className="flex items-center gap-2">
      <IconButton
        component={Link}
        href={AppRoutePaths.CHAT}
        aria-label="Voltar para conversas"
        size="small"
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>
      <div className="min-w-0 flex-1">
        <Typography
          variant="caption"
          color="text.secondary"
          component="div"
          sx={{ letterSpacing: 1, textTransform: 'uppercase' }}
        >
          Assistente
        </Typography>
        <Typography variant="h6" component="h1" className="truncate">
          {title}
        </Typography>
      </div>
    </header>
  );
}
