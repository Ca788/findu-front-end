'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MessageBubble } from '@/features/chat/components/messages/MessageBubble';
import { ThinkingStatus } from '@/features/chat/components/messages/ThinkingStatus';
import type { ChatMessage } from '@/features/chat/models/message.model';

interface MessagesListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  /** Show thinking state immediately after send, before the assistant row arrives. */
  awaitingReply?: boolean;
}

function isLiveAssistant(message: ChatMessage | undefined): boolean {
  if (!message || message.role !== 'assistant') return false;
  return message.status === 'pending' || message.status === 'processing';
}

export function MessagesList({
  messages,
  isLoading,
  awaitingReply = false,
}: MessagesListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const last = messages[messages.length - 1];
  const lastMessageStatus = last?.status;
  const lastBodyLen = last?.body?.length ?? 0;
  const showPlaceholderThinking =
    awaitingReply && !isLiveAssistant(last) && (last?.role === 'user' || messages.length === 0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, lastMessageStatus, lastBodyLen, showPlaceholderThinking]);

  if (!isLoading && messages.length === 0 && !showPlaceholderThinking) {
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
        gap: 1.75,
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
      {showPlaceholderThinking && <ThinkingStatus urgent />}
      <div ref={bottomRef} />
    </Box>
  );
}
