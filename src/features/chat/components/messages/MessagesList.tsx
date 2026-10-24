'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MessageBubble } from '@/features/chat/components/messages/MessageBubble';
import type { ChatMessage, MessageAction } from '@/features/chat/models/message.model';

interface MessagesListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  awaitingReply?: boolean;
  revealActions?: boolean;
  onAction?: (action: MessageAction) => void;
}

const THINKING_KEY = 'assistant-thinking';

function isLiveAssistant(message: ChatMessage | undefined): boolean {
  if (!message || message.role !== 'assistant') return false;
  return message.status === 'pending' || message.status === 'processing';
}

function hasContent(message: ChatMessage): boolean {
  return (
    !!message.body ||
    (message.kind === 'audio' && !!message.audio_url) ||
    (message.attachments?.length ?? 0) > 0
  );
}

function messageKey(message: ChatMessage): string {
  if (isLiveAssistant(message) && !hasContent(message)) return THINKING_KEY;
  return message.client_message_id ?? message.id;
}

function thinkingPlaceholder(after: ChatMessage | undefined): ChatMessage {
  const now = new Date().toISOString();
  return {
    id: THINKING_KEY,
    conversation_id: after?.conversation_id ?? '',
    parent_message_id: after?.id ?? null,
    client_message_id: null,
    role: 'assistant',
    kind: 'text',
    body: null,
    status: 'pending',
    intent: null,
    audio_url: null,
    attachments: [],
    created_at: now,
    updated_at: now,
  };
}

export function MessagesList({
  messages,
  isLoading,
  awaitingReply = false,
  revealActions = true,
  onAction,
}: MessagesListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const last = messages[messages.length - 1];
  const lastMessageStatus = last?.status;
  const lastBodyLen = last?.body?.length ?? 0;
  const showPlaceholderThinking =
    awaitingReply && !isLiveAssistant(last) && (last?.role === 'user' || messages.length === 0);
  const items = showPlaceholderThinking ? [...messages, thinkingPlaceholder(last)] : messages;

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
      {items.map((message) => (
        <MessageBubble
          key={messageKey(message)}
          message={message}
          onAction={onAction}
          actionsDisabled={awaitingReply}
          revealActions={revealActions}
        />
      ))}
      <div ref={bottomRef} />
    </Box>
  );
}
