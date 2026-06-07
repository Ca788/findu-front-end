import { useQuery } from '@tanstack/react-query';
import { listMessages } from '@/features/chat/gateway/messages.gateway';
import type { ChatMessage } from '@/features/chat/models/message.model';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';

export const MESSAGES_KEY = 'chat:messages';

export function useMessages(conversationId: string | undefined) {
  return useQuery<PaginatedSuccessResponse<ChatMessage>>({
    queryKey: [MESSAGES_KEY, conversationId],
    queryFn: () => listMessages(conversationId as string, { page: 1, perPage: 50 }),
    enabled: !!conversationId,
  });
}
