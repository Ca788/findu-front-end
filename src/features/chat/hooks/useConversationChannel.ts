import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getCableConsumer } from '@/infrastructure/cable.client';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { ChatMessage } from '@/features/chat/models/message.model';
import { MESSAGES_KEY } from '@/features/chat/hooks/useMessages';

type CableEvent = {
  type: 'message.upserted';
  message: ChatMessage;
};

const EMPTY_PAGINATION = {
  currentPage: 1,
  nextPage: null,
  prevPage: null,
  totalPages: 1,
  totalCount: 0,
};

function upsertMessage(
  cache: PaginatedSuccessResponse<ChatMessage> | undefined,
  incoming: ChatMessage,
): PaginatedSuccessResponse<ChatMessage> {
  if (!cache) {
    return {
      success: true,
      data: [incoming],
      pagination: { ...EMPTY_PAGINATION, totalCount: 1 },
    };
  }

  const idx = cache.data.findIndex((m) => m.id === incoming.id);
  const nextData =
    idx === -1
      ? [...cache.data, incoming]
      : cache.data.map((m, i) => (i === idx ? { ...m, ...incoming } : m));

  return { ...cache, data: nextData };
}

export function useConversationChannel(conversationId: string | undefined): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;
    const consumer = getCableConsumer();
    if (!consumer) return;

    const subscription = consumer.subscriptions.create(
      { channel: 'Chat::ConversationChannel', conversation_id: conversationId },
      {
        received(data: CableEvent) {
          if (data?.type !== 'message.upserted' || !data.message) return;

          queryClient.setQueryData<PaginatedSuccessResponse<ChatMessage>>(
            [MESSAGES_KEY, conversationId],
            (cache) => upsertMessage(cache, data.message),
          );
        },
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, queryClient]);
}
