'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getCableConsumer } from '@/infrastructure/cable.client';
import { getMessage, listMessages } from '@/features/chat/gateway/messages.gateway';
import { peekPendingOptimistic } from '@/features/chat/hooks/useSendMessage';
import type {
  ChatMessage,
  MessageAttachment,
  MessageStatus,
} from '@/features/chat/models/message.model';

export type MessagesStatus = 'idle' | 'loading' | 'ready' | 'error';

interface MessageDelta {
  id: string;
  delta: string;
}

type ConversationEvent =
  | { type: 'message.upserted'; message: ChatMessage }
  | { type: 'message.delta'; message: MessageDelta };

const STATUS_RANK: Record<MessageStatus, number> = {
  pending: 0,
  processing: 1,
  completed: 2,
  failed: 2,
};

function isFinal(status: MessageStatus): boolean {
  return status === 'completed' || status === 'failed';
}

function sameMessage(a: ChatMessage, b: ChatMessage): boolean {
  if (a.id === b.id) return true;
  if (a.client_message_id && a.client_message_id === b.client_message_id) return true;
  if (b.client_message_id && a.id === b.client_message_id) return true;
  return false;
}

function isBlobUrl(url: string | null | undefined): boolean {
  return !!url && url.startsWith('blob:');
}

// Um snapshot (GET) pode chegar depois de eventos mais novos do Cable e trazer
// um estado anterior da mesma mensagem. Nunca regredimos status de uma mensagem
// que já veio do servidor, e nunca encolhemos o texto de uma resposta em streaming.
function pickStatus(previous: ChatMessage, incoming: ChatMessage): MessageStatus {
  const serverBacked = previous.id !== previous.client_message_id;
  if (!serverBacked) return incoming.status;
  return STATUS_RANK[incoming.status] >= STATUS_RANK[previous.status]
    ? incoming.status
    : previous.status;
}

function pickBody(previous: ChatMessage, incoming: ChatMessage): string | null {
  if (isFinal(incoming.status)) return incoming.body;
  const previousLength = previous.body?.length ?? 0;
  const incomingLength = incoming.body?.length ?? 0;
  return previousLength > incomingLength ? previous.body : incoming.body;
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
    status: pickStatus(previous, incoming),
    body: pickBody(previous, incoming),
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

// Retorna a lista atualizada, ou null quando a mensagem ainda não é conhecida.
function appendDelta(messages: ChatMessage[], { id, delta }: MessageDelta): ChatMessage[] | null {
  const index = messages.findIndex((message) => message.id === id);
  if (index === -1) return null;

  const current = messages[index];
  if (isFinal(current.status)) return messages;

  const next = messages.slice();
  next[index] = {
    ...current,
    body: (current.body ?? '') + delta,
    status: 'processing',
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

  // Espelho síncrono da lista, para decidir fora do updater do setState se um
  // delta pertence a uma mensagem que ainda não conhecemos.
  const messagesRef = useRef<ChatMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    let active = true;
    let subscription: { unsubscribe: () => void } | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    // Deltas que chegam para uma resposta que ainda não está na lista (o
    // `message.upserted` inicial se perdeu entre o fetch e a confirmação da
    // subscrição). Guardamos o texto e buscamos a mensagem uma única vez;
    // o texto bufferizado é sempre anterior ao que for anexado depois.
    const pendingDeltas = new Map<string, string>();
    const fetching = new Set<string>();

    const loadSnapshot = () => {
      listMessages(conversationId, { page: 1, perPage: 50 })
        .then((response) => {
          if (!active) return;
          setMessages((current) => response.data.reduce(upsert, current));
          setStatus('ready');
        })
        .catch(() => {
          if (active) setStatus((current) => (current === 'ready' ? current : 'error'));
        });
    };

    const fetchUnknownMessage = (id: string) => {
      if (fetching.has(id)) return;
      fetching.add(id);

      getMessage(conversationId, id)
        .then((fetched) => {
          if (!active) return;
          const buffered = pendingDeltas.get(id) ?? '';
          pendingDeltas.delete(id);

          setMessages((current) => {
            const index = current.findIndex((message) => message.id === fetched.id);
            if (index === -1) {
              const body = isFinal(fetched.status) ? fetched.body : (fetched.body ?? '') + buffered;
              return upsert(current, { ...fetched, body });
            }

            const existing = current[index];
            if (!buffered || isFinal(existing.status)) return current;
            const next = current.slice();
            next[index] = { ...existing, body: buffered + (existing.body ?? '') };
            return next;
          });
        })
        .catch(() => {
          pendingDeltas.delete(id);
        })
        .finally(() => {
          fetching.delete(id);
        });
    };

    const applyDelta = (delta: MessageDelta) => {
      const known = messagesRef.current.some((message) => message.id === delta.id);
      if (!known) {
        pendingDeltas.set(delta.id, (pendingDeltas.get(delta.id) ?? '') + delta.delta);
        fetchUnknownMessage(delta.id);
        return;
      }

      setMessages((current) => appendDelta(current, delta) ?? current);
    };

    const subscribe = () => {
      const consumer = getCableConsumer();
      if (!consumer) {
        retryTimer = setTimeout(subscribe, 500);
        return;
      }

      subscription = consumer.subscriptions.create(
        { channel: 'Chat::ConversationChannel', conversation_id: conversationId },
        {
          // Só depois da confirmação é que eventos passam a ser entregues.
          // O snapshot aqui cobre tudo que foi emitido antes disso, inclusive
          // em reconexões.
          connected() {
            if (active) loadSnapshot();
          },
          received(event: ConversationEvent) {
            if (!active || !event?.message) return;

            if (event.type === 'message.upserted') {
              setMessages((current) => upsert(current, event.message));
            } else if (event.type === 'message.delta') {
              applyDelta(event.message);
            }
          },
        },
      );
    };

    // Primeiro carregamento sem esperar o WebSocket; `connected` recarrega
    // para fechar a janela entre este fetch e a subscrição.
    loadSnapshot();
    subscribe();

    return () => {
      active = false;
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
