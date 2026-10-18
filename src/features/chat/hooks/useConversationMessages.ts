'use client';

import { useCallback, useEffect, useState } from 'react';
import { getCableConsumer } from '@/infrastructure/cable.client';
import { listMessages } from '@/features/chat/gateway/messages.gateway';
import { peekPendingOptimistic } from '@/features/chat/hooks/useSendMessage';
import type { ChatMessage, MessageAttachment } from '@/features/chat/models/message.model';

export type MessagesStatus = 'idle' | 'loading' | 'ready' | 'error';

interface MessageDelta {
  id: string;
  delta: string;
}

type ConversationEvent =
  | { type: 'message.upserted'; message: ChatMessage }
  | { type: 'message.delta'; message: MessageDelta };

function sameMessage(a: ChatMessage, b: ChatMessage): boolean {
  if (a.id === b.id) return true;
  if (a.client_message_id && a.client_message_id === b.client_message_id) return true;
  if (b.client_message_id && a.id === b.client_message_id) return true;
  return false;
}

function isBlobUrl(url: string | null | undefined): boolean {
  return !!url && url.startsWith('blob:');
}

function mergeAttachments(
  previous: MessageAttachment[] | undefined,
  incoming: MessageAttachment[] | undefined,
): MessageAttachment[] | undefined {
  if (!incoming || incoming.length === 0) return previous ?? incoming;
  if (!previous || previous.length === 0) return incoming;

  const previousByName = new Map(previous.map((item) => [item.filename, item]));
  return incoming.map((attachment, index) => {
    const local = previousByName.get(attachment.filename) ?? previous[index];
    if (local && isBlobUrl(local.url)) {
      return { ...attachment, url: local.url };
    }
    return attachment;
  });
}

function upsert(messages: ChatMessage[], incoming: ChatMessage): ChatMessage[] {
  const index = messages.findIndex((message) => sameMessage(message, incoming));
  if (index === -1) return [...messages, incoming];

  const previous = messages[index];
  const next = messages.slice();
  next[index] = {
    ...previous,
    ...incoming,
    client_message_id:
      incoming.client_message_id ?? previous.client_message_id ?? null,
    audio_url: isBlobUrl(previous.audio_url)
      ? previous.audio_url
      : incoming.audio_url || previous.audio_url,
    attachments: mergeAttachments(previous.attachments, incoming.attachments),
    actions: incoming.actions ?? previous.actions,
    card: incoming.card ?? previous.card,
  };
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
    const seed = conversationId ? peekPendingOptimistic(conversationId) : undefined;
    setMessages(seed ? [seed] : []);
    setStatus(seed ? 'ready' : conversationId ? 'loading' : 'idle');
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

  const addOptimistic = useCallback((message: ChatMessage) => {
    setMessages((current) => upsert(current, message));
  }, []);

  const markOptimisticFailed = useCallback((clientMessageId: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === clientMessageId || message.client_message_id === clientMessageId
          ? { ...message, status: 'failed' as const }
          : message,
      ),
    );
  }, []);

  return { messages, status, addOptimistic, markOptimisticFailed };
}
