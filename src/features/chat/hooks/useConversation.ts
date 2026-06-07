import { useAppQuery } from '@/hooks/useAppQuery';
import { getConversation } from '@/features/chat/gateway/conversations.gateway';
import type { Conversation } from '@/features/chat/models/conversation.model';

export const CONVERSATION_DETAIL_KEY = 'chat:conversation';

export function useConversation(id: string | undefined) {
  return useAppQuery<Conversation>({
    queryKey: [CONVERSATION_DETAIL_KEY, id],
    queryFn: () => getConversation(id as string),
    enabled: !!id,
    staleTime: 60_000,
  });
}
