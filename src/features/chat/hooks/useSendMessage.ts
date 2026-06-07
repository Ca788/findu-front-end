import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendMessage } from '@/features/chat/gateway/messages.gateway';
import { MESSAGES_KEY } from '@/features/chat/hooks/useMessages';
import type { SendMessageInput } from '@/features/chat/models/message.model';

interface SendArgs {
  conversationId: string;
  input: SendMessageInput;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, input }: SendArgs) =>
      sendMessage(conversationId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_KEY, variables.conversationId],
      });
    },
  });
}
