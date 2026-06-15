import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateConversation } from '@/features/chat/gateway/conversations.gateway';
import { CONVERSATIONS_LIST_KEY } from '@/features/chat/hooks/useConversations';
import type { ConversationInput } from '@/features/chat/models/conversation.model';

interface UpdateInput extends ConversationInput {
  id: string;
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateInput) => updateConversation(id, input),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_LIST_KEY] });
      queryClient.invalidateQueries({ queryKey: ['chat:conversation', conversation.id] });
    },
  });
}
