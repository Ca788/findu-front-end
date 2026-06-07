'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ConversationCard } from '@/features/chat/components/conversations/ConversationCard';
import type { Conversation } from '@/features/chat/models/conversation.model';

interface ChatListProps {
  conversations: Conversation[];
  isLoading: boolean;
  onArchive: (conversation: Conversation) => void;
}

export function ChatList({ conversations, isLoading, onArchive }: ChatListProps) {
  if (!isLoading && conversations.length === 0) {
    return (
      <Paper className="rounded-2xl px-4 py-10 text-center">
        <Typography variant="body2" color="text.secondary">
          Nenhuma conversa ainda. Crie uma para começar.
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.id}
          conversation={conversation}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
