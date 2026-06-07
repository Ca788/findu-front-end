'use client';

import { useEffect, useRef } from 'react';
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
      <div className="flex flex-1 items-center justify-center px-6 py-10 text-center min-h-[200px]">
        <Typography variant="body2" color="text.secondary">
          Envie a primeira mensagem para iniciar a conversa.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-1 py-2 min-h-[300px] max-h-[calc(100vh-280px)]">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
