'use client';

import { useCallback } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useConversation } from '@/features/chat/hooks/useConversation';
import { useConversationMessages } from '@/features/chat/hooks/useConversationMessages';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { ChatConversationHeader } from '@/features/chat/components/messages/ChatConversationHeader';
import { MessagesList } from '@/features/chat/components/messages/MessagesList';
import { ChatComposer } from '@/features/chat/components/screen/ChatComposer';
import { ChatLayout } from '@/features/chat/components/screen/ChatLayout';
import type { SendMessageInput } from '@/features/chat/models/message.model';

interface ChatConversationPageProps {
  conversationId: string;
}

export function ChatConversationPage({ conversationId }: ChatConversationPageProps) {
  useConversation(conversationId);
  const { messages, status } = useConversationMessages(conversationId);
  const { send, isSending } = useSendMessage(conversationId);

  const handleSubmit = useCallback(
    (input: SendMessageInput) => send(input),
    [send],
  );

  const isLoading = status === 'loading';
  const lastMessage = messages[messages.length - 1];
  const awaitingReply = isSending || lastMessage?.role === 'user';

  return (
    <ChatLayout
      topbar={
        <Box
          sx={{
            mx: 'auto',
            width: '100%',
            maxWidth: 880,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            px: { xs: 0.5, md: 1 },
          }}
        >
          <ChatConversationHeader />
        </Box>
      }
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
          />
        </>
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
