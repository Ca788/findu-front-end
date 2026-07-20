'use client';

import Link from 'next/link';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ChevronRightIcon from '@mui/icons-material/ChevronRightOutlined';
import ArchiveIcon from '@mui/icons-material/ArchiveOutlined';
import { formatDateTimeBR } from '@/utils/date';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type { Conversation } from '@/features/chat/models/conversation.model';

interface ConversationCardProps {
  conversation: Conversation;
  onArchive: (conversation: Conversation) => void;
}

function defaultTitle(conversation: Conversation): string {
  if (conversation.title?.trim()) return conversation.title;
  return `Conversa de ${formatDateTimeBR(conversation.created_at)}`;
}

export function ConversationCard({ conversation, onArchive }: ConversationCardProps) {
  const href = AppRoutePaths.chatConversation(conversation.id);
  return (
    <Paper className="flex items-center gap-3 rounded-2xl px-4 py-3">
      <Link href={href} className="flex flex-1 min-w-0 items-center gap-3 no-underline text-inherit">
        <div className="flex flex-1 min-w-0 flex-col">
          <Typography variant="body1" className="font-medium truncate">
            {defaultTitle(conversation)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {conversation.messages_count != null
              ? `${conversation.messages_count} mensagens · `
              : ''}
            Atualizada em {formatDateTimeBR(conversation.updated_at)}
          </Typography>
        </div>
        <ChevronRightIcon color="action" />
      </Link>
      <Tooltip title="Arquivar">
        <IconButton size="small" onClick={() => onArchive(conversation)}>
          <ArchiveIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
