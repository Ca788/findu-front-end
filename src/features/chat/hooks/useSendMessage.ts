'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { sendMessage } from '@/features/chat/gateway/messages.gateway';
import type { ChatMessage, SendMessageInput } from '@/features/chat/models/message.model';

interface UseSendMessageOptions {
  onOptimistic?: (message: ChatMessage) => void;
  onOptimisticFailed?: (clientMessageId: string) => void;
}

function createClientId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `tmp-${Date.now()}`;
}

function buildOptimisticMessage(
  conversationId: string,
  input: SendMessageInput,
): ChatMessage {
  const clientId = input.client_message_id || createClientId();
  const now = new Date().toISOString();
  const attachments = (input.attachments ?? []).map((file, index) => ({
    id: `local-${clientId}-${index}`,
    filename: file.name,
    content_type: file.type || 'application/octet-stream',
    byte_size: file.size,
    url: URL.createObjectURL(file),
  }));

  return {
    id: clientId,
    conversation_id: conversationId,
    parent_message_id: null,
    client_message_id: clientId,
    role: 'user',
    kind: input.audio ? 'audio' : 'text',
    body: input.body ?? null,
    status: 'pending',
    intent: null,
    audio_url: input.audio ? URL.createObjectURL(input.audio) : null,
    attachments,
    created_at: now,
    updated_at: now,
  };
}

export function useSendMessage(
  conversationId: string,
  options: UseSendMessageOptions = {},
) {
  const [isSending, setIsSending] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const send = useCallback(
    async (input: SendMessageInput): Promise<ChatMessage> => {
      const payload: SendMessageInput = {
        ...input,
        client_message_id: input.client_message_id || createClientId(),
      };

      const optimistic = buildOptimisticMessage(conversationId, payload);
      optionsRef.current.onOptimistic?.(optimistic);
      setIsSending(true);

      try {
        return await sendMessage(conversationId, payload);
      } catch (err) {
        if (payload.client_message_id) {
          optionsRef.current.onOptimisticFailed?.(payload.client_message_id);
        }
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId],
  );

  return { send, isSending };
}
