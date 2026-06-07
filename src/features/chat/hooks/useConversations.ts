import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  listConversations,
  type ListConversationsParams,
} from '@/features/chat/gateway/conversations.gateway';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { Conversation } from '@/features/chat/models/conversation.model';

export const CONVERSATIONS_LIST_KEY = 'chat:conversations:list';

export function useConversations(params: ListConversationsParams = {}) {
  return useAppQuery<PaginatedSuccessResponse<Conversation>>({
    queryKey: [CONVERSATIONS_LIST_KEY, params],
    queryFn: () => listConversations(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
