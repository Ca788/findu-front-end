import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getCableConsumer } from '@/infrastructure/cable.client';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import { CONVERSATIONS_LIST_KEY } from '@/features/chat/hooks/useConversations';
import { CONVERSATION_DETAIL_KEY } from '@/features/chat/hooks/useConversation';
import type { Conversation } from '@/features/chat/models/conversation.model';

type InboxEvent =
  | { type: 'conversation.upserted'; conversation: Conversation }
  | { type: 'conversation.archived'; conversation: Conversation };

export function useChatInboxChannel() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let subscription: { unsubscribe: () => void } | null = null;

    const apply = (event: InboxEvent) => {
      if (!event?.conversation) return;

      switch (event.type) {
        case 'conversation.upserted':
          queryClient.setQueriesData<PaginatedSuccessResponse<Conversation>>(
            { queryKey: [CONVERSATIONS_LIST_KEY] },
            (current) => upsertConversation(current, event.conversation),
          );
          queryClient.setQueryData(
            [CONVERSATION_DETAIL_KEY, event.conversation.id],
            event.conversation,
          );
          return;
        case 'conversation.archived':
          queryClient.setQueriesData<PaginatedSuccessResponse<Conversation>>(
            { queryKey: [CONVERSATIONS_LIST_KEY] },
            (current) => removeConversation(current, event.conversation.id),
          );
          queryClient.removeQueries({
            queryKey: [CONVERSATION_DETAIL_KEY, event.conversation.id],
          });
          return;
        default: {
          const _exhaustive: never = event;
          return _exhaustive;
        }
      }
    };

    const subscribe = () => {
      if (!active) return;
      const consumer = getCableConsumer();
      if (!consumer) {
        retryTimer = setTimeout(subscribe, 1000);
        return;
      }

      subscription = consumer.subscriptions.create(
        { channel: 'Chat::InboxChannel' },
        {
          received(event: InboxEvent) {
            if (active) apply(event);
          },
        },
      );
    };

    subscribe();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
      subscription?.unsubscribe();
    };
  }, [queryClient]);
}

function upsertConversation(
  current: PaginatedSuccessResponse<Conversation> | undefined,
  conversation: Conversation,
): PaginatedSuccessResponse<Conversation> | undefined {
  if (!current) return current;

  const items = current.data ?? [];
  const existed = items.some((item) => item.id === conversation.id);
  const data = [conversation, ...items.filter((item) => item.id !== conversation.id)];

  return {
    ...current,
    data,
    pagination: current.pagination
      ? {
          ...current.pagination,
          totalCount: existed ? current.pagination.totalCount : current.pagination.totalCount + 1,
        }
      : current.pagination,
  };
}

function removeConversation(
  current: PaginatedSuccessResponse<Conversation> | undefined,
  id: string,
): PaginatedSuccessResponse<Conversation> | undefined {
  if (!current) return current;

  const items = current.data ?? [];
  if (!items.some((item) => item.id === id)) return current;

  return {
    ...current,
    data: items.filter((item) => item.id !== id),
    pagination: current.pagination
      ? { ...current.pagination, totalCount: Math.max(0, current.pagination.totalCount - 1) }
      : current.pagination,
  };
}
