'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MessageBubble } from '@/features/chat/components/messages/MessageBubble';
import type { ChatMessage } from '@/features/chat/models/message.model';

interface MessagesListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessagesList({ messages, isLoading }: MessagesListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastMessageStatus = messages[messages.length - 1]?.status;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, lastMessageStatus]);

  if (!isLoading && messages.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 4,
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Envie a primeira mensagem para iniciar a conversa.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        px: { xs: 1.5, md: 3 },
        py: 2,
        mx: 'auto',
        width: '100%',
        maxWidth: 880,
      }}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </Box>
  );
}
