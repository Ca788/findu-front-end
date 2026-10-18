'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useConversation } from '@/features/chat/hooks/useConversation';
import { useConversationMessages } from '@/features/chat/hooks/useConversationMessages';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { MessagesList } from '@/features/chat/components/messages/MessagesList';
import { ChatComposer } from '@/features/chat/components/screen/ChatComposer';
import { ChatLayout } from '@/features/chat/components/screen/ChatLayout';
import { SuggestedPromptsSwiper } from '@/features/chat/components/screen/SuggestedPromptsSwiper';
import type { ChatSuggestedPrompt } from '@/features/chat/constants/chatSuggestedPrompts';
import type { MessageAction, SendMessageInput } from '@/features/chat/models/message.model';

interface ChatConversationPageProps {
  conversationId: string;
}

export function ChatConversationPage({ conversationId }: ChatConversationPageProps) {
  const router = useRouter();
  useConversation(conversationId);
  const { messages, status, addOptimistic, markOptimisticFailed } =
    useConversationMessages(conversationId);
  const { send, isSending } = useSendMessage(conversationId, {
    onOptimistic: addOptimistic,
    onOptimisticFailed: markOptimisticFailed,
  });

  const handleSubmit = useCallback(
    (input: SendMessageInput) => send(input),
    [send],
  );

  const handleSelectPrompt = useCallback(
    (prompt: ChatSuggestedPrompt) => {
      if (isSending) return;
      void send({ body: prompt.message });
    },
    [isSending, send],
  );

  const handleAction = useCallback(
    (action: MessageAction) => {
      switch (action.kind) {
        case 'send_message':
          if (action.message) void send({ body: action.message });
          break;
        case 'navigate':
          if (action.href) router.push(action.href);
          break;
        default: {
          const exhaustive: never = action.kind;
          return exhaustive;
        }
      }
    },
    [router, send],
  );

  const isLoading = status === 'loading';
  const lastMessage = messages[messages.length - 1];
  const awaitingReply =
    isSending ||
    (lastMessage?.role === 'user' && lastMessage.status !== 'failed');

  return (
    <ChatLayout
      messages={
        <>
          {status === 'error' && (
            <Box sx={{ px: 2, pt: 1 }}>
              <Alert severity="error">Erro ao carregar mensagens.</Alert>
            </Box>
          )}
          {isLoading && <LinearProgress />}
          <MessagesList
            messages={messages}
            isLoading={isLoading}
            awaitingReply={awaitingReply}
            onAction={handleAction}
          />
        </>
      }
      suggestions={
        <SuggestedPromptsSwiper onSelectPrompt={handleSelectPrompt} disabled={awaitingReply} />
      }
      composer={
        <ChatComposer
          onSubmit={handleSubmit}
          isSending={isSending}
          placeholder="Pergunte ao Findu…"
        />
      }
    />
  );
}
