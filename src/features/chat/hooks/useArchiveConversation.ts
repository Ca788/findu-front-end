import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveConversation } from '@/features/chat/gateway/conversations.gateway';
import { CONVERSATIONS_LIST_KEY } from '@/features/chat/hooks/useConversations';

export function useArchiveConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_LIST_KEY] });
    },
  });
}
