'use client';

import { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { MessageBubble } from '@/features/chat/components/messages/MessageBubble';
import type { ChatMessage } from '@/features/chat/models/message.model';

interface FloatingMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function FloatingMessages({ messages, isLoading }: FloatingMessagesProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastStatus = messages[messages.length - 1]?.status;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, lastStatus]);

  if (!isLoading && messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-8 text-center min-h-[160px]">
        <div className="flex flex-col gap-1">
          <Typography variant="body2" color="text.secondary">
            Como posso te ajudar hoje?
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Escolha um agente acima ou pergunte qualquer coisa.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
