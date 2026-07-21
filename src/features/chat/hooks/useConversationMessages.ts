'use client';

import { useEffect, useState } from 'react';
import { getCableConsumer } from '@/infrastructure/cable.client';
import { listMessages } from '@/features/chat/gateway/messages.gateway';
import type { ChatMessage } from '@/features/chat/models/message.model';

export type MessagesStatus = 'idle' | 'loading' | 'ready' | 'error';

interface MessageDelta {
  id: string;
  delta: string;
}

type ConversationEvent =
  | { type: 'message.upserted'; message: ChatMessage }
  | { type: 'message.delta'; message: MessageDelta };

function upsert(messages: ChatMessage[], incoming: ChatMessage): ChatMessage[] {
  const index = messages.findIndex((message) => message.id === incoming.id);
  if (index === -1) return [...messages, incoming];

  const next = messages.slice();
  next[index] = { ...next[index], ...incoming };
  return next;
}

function appendDelta(messages: ChatMessage[], { id, delta }: MessageDelta): ChatMessage[] {
  const index = messages.findIndex((message) => message.id === id);
  if (index === -1) return messages;

  const next = messages.slice();
  const current = next[index];
  next[index] = {
    ...current,
    body: (current.body ?? '') + delta,
    status: current.status === 'completed' ? current.status : 'processing',
  };
  return next;
}

export function useConversationMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<MessagesStatus>('idle');
  const [loadedId, setLoadedId] = useState<string | undefined>(undefined);

  if (conversationId !== loadedId) {
    setLoadedId(conversationId);
    setMessages([]);
    setStatus(conversationId ? 'loading' : 'idle');
  }

  useEffect(() => {
    if (!conversationId) return;

    let active = true;

    listMessages(conversationId, { page: 1, perPage: 50 })
      .then((response) => {
        if (!active) return;
        setMessages((current) => response.data.reduce(upsert, current));
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    let subscription: { unsubscribe: () => void } | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const subscribe = () => {
      const consumer = getCableConsumer();
      if (!consumer) {
        retryTimer = setTimeout(subscribe, 500);
        return;
      }

      subscription = consumer.subscriptions.create(
        { channel: 'Chat::ConversationChannel', conversation_id: conversationId },
        {
          received(event: ConversationEvent) {
            if (!event?.message) return;

            if (event.type === 'message.upserted') {
              setMessages((current) => upsert(current, event.message));
            } else if (event.type === 'message.delta') {
              setMessages((current) => appendDelta(current, event.message));
            }
          },
        },
      );
    };

    subscribe();

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      subscription?.unsubscribe();
    };
  }, [conversationId]);

  return { messages, status };
}
