'use client';

import { useCallback, useEffect, useRef } from 'react';
import { sendMessage } from '@/features/chat/gateway/messages.gateway';
import type { ChatMessage, SendMessageInput } from '@/features/chat/models/message.model';

interface UseSendMessageOptions {
  onOptimistic?: (message: ChatMessage) => void;
  onOptimisticFailed?: (clientMessageId: string) => void;
}

interface PendingSend {
  conversationId: string;
  input: SendMessageInput;
  optimistic: ChatMessage;
}

interface SendOptions {
  skipOptimistic?: boolean;
}

const startedPending = new Set<string>();
let pendingSend: PendingSend | null = null;

export function createClientId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `tmp-${Date.now()}`;
}

export function buildOptimisticMessage(
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

export function stashPendingSend(
  conversationId: string,
  input: SendMessageInput,
  optimistic: ChatMessage,
): void {
  pendingSend = {
    conversationId,
    input,
    optimistic: { ...optimistic, conversation_id: conversationId },
  };
  startedPending.delete(conversationId);
}

export function peekPendingOptimistic(conversationId: string): ChatMessage | undefined {
  if (pendingSend?.conversationId !== conversationId) return undefined;
  return pendingSend.optimistic;
}

export function takePendingSend(conversationId: string): SendMessageInput | undefined {
  if (pendingSend?.conversationId !== conversationId) return undefined;
  if (startedPending.has(conversationId)) return undefined;
  startedPending.add(conversationId);
  return pendingSend.input;
}

export function clearPendingSend(conversationId: string): void {
  if (pendingSend?.conversationId === conversationId) {
    pendingSend = null;
  }
  startedPending.delete(conversationId);
}

export function useSendMessage(
  conversationId: string,
  options: UseSendMessageOptions = {},
) {
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const send = useCallback(
    async (input: SendMessageInput, sendOptions: SendOptions = {}): Promise<ChatMessage> => {
      const payload: SendMessageInput = {
        ...input,
        client_message_id: input.client_message_id || createClientId(),
      };

      const optimistic =
        (sendOptions.skipOptimistic ? peekPendingOptimistic(conversationId) : undefined) ??
        buildOptimisticMessage(conversationId, payload);

      if (!sendOptions.skipOptimistic) {
        optionsRef.current.onOptimistic?.(optimistic);
      }

      void sendMessage(conversationId, payload)
        .then((created) => {
          optionsRef.current.onOptimistic?.(created);
          clearPendingSend(conversationId);
        })
        .catch(() => {
          if (payload.client_message_id) {
            optionsRef.current.onOptimisticFailed?.(payload.client_message_id);
          }
          clearPendingSend(conversationId);
        });

      return optimistic;
    },
    [conversationId],
  );

  return { send };
}
