import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConversation } from '@/features/chat/gateway/conversations.gateway';
import { CONVERSATIONS_LIST_KEY } from '@/features/chat/hooks/useConversations';
import type { ConversationInput } from '@/features/chat/models/conversation.model';

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ConversationInput) => createConversation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_LIST_KEY] });
    },
  });
}
