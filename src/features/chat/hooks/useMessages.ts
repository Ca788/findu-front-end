import { useQuery } from '@tanstack/react-query';
import { listMessages } from '@/features/chat/gateway/messages.gateway';
import type { ChatMessage } from '@/features/chat/models/message.model';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';

export const MESSAGES_KEY = 'chat:messages';

const PENDING_STATUSES: ChatMessage['status'][] = ['pending', 'processing'];
const POLL_INTERVAL_MS = 2000;

export function useMessages(conversationId: string | undefined) {
  return useQuery<PaginatedSuccessResponse<ChatMessage>>({
    queryKey: [MESSAGES_KEY, conversationId],
    queryFn: () => listMessages(conversationId as string, { page: 1, perPage: 50 }),
    enabled: !!conversationId,
    refetchInterval: (query) => {
      const messages = query.state.data?.data ?? [];
      const hasPending = messages.some((m) => PENDING_STATUSES.includes(m.status));
      return hasPending ? POLL_INTERVAL_MS : false;
    },
  });
}
