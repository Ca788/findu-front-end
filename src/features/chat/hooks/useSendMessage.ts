'use client';

import { useCallback, useState } from 'react';
import { sendMessage } from '@/features/chat/gateway/messages.gateway';
import type { ChatMessage, SendMessageInput } from '@/features/chat/models/message.model';

export function useSendMessage(conversationId: string) {
  const [isSending, setIsSending] = useState(false);

  const send = useCallback(
    async (input: SendMessageInput): Promise<ChatMessage> => {
      setIsSending(true);
      try {
        return await sendMessage(conversationId, input);
      } finally {
        setIsSending(false);
      }
    },
    [conversationId],
  );

  return { send, isSending };
}
