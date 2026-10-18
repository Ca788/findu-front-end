'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useConversation } from '@/features/chat/hooks/useConversation';
import { useConversationMessages } from '@/features/chat/hooks/useConversationMessages';
import { takePendingSend, useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { MessagesList } from '@/features/chat/components/messages/MessagesList';
import { ChatComposer } from '@/features/chat/components/screen/ChatComposer';
import { ChatLayout } from '@/features/chat/components/screen/ChatLayout';
import { SuggestedPromptsSwiper } from '@/features/chat/components/screen/SuggestedPromptsSwiper';
import type { ChatSuggestedPrompt } from '@/features/chat/constants/chatSuggestedPrompts';
import type { MessageAction, SendMessageInput } from '@/features/chat/models/message.model';

const ACTION_IDLE_MS = 8000;

interface ChatConversationPageProps {
  conversationId: string;
}

export function ChatConversationPage({ conversationId }: ChatConversationPageProps) {
  const router = useRouter();
  const { showError } = useSnackbar();
  useConversation(conversationId);
  const { messages, status, addOptimistic, markOptimisticFailed } =
    useConversationMessages(conversationId);
  const { send } = useSendMessage(conversationId, {
    onOptimistic: addOptimistic,
    onOptimisticFailed: (clientMessageId) => {
      markOptimisticFailed(clientMessageId);
      showError('Erro ao enviar mensagem');
    },
  });

  useEffect(() => {
    const pending = takePendingSend(conversationId);
    if (!pending) return;
    void send(pending, { skipOptimistic: true });
  }, [conversationId, send]);

  const handleSubmit = useCallback(
    (input: SendMessageInput) => send(input),
    [send],
  );

  const handleSelectPrompt = useCallback(
    (prompt: ChatSuggestedPrompt) => {
      void send({ body: prompt.message });
    },
    [send],
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

  const isLoading = status === 'loading' && messages.length === 0;
  const lastMessage = messages[messages.length - 1];
  const awaitingReply =
    lastMessage?.role === 'user' && lastMessage.status !== 'failed';
  const lastIsStreaming =
    lastMessage?.role === 'assistant' &&
    (lastMessage.status === 'pending' || lastMessage.status === 'processing');
  const chatBusy = awaitingReply || lastIsStreaming;
  const [revealExtras, setRevealExtras] = useState(true);

  useEffect(() => {
    if (chatBusy) {
      setRevealExtras(false);
      return;
    }
    const timer = window.setTimeout(() => setRevealExtras(true), ACTION_IDLE_MS);
    return () => window.clearTimeout(timer);
  }, [chatBusy, messages.length]);

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
            revealActions={revealExtras}
            onAction={handleAction}
          />
        </>
      }
      suggestions={
        <Box
          sx={{
            overflow: 'hidden',
            maxHeight: revealExtras ? 220 : 0,
            opacity: revealExtras ? 1 : 0,
            pointerEvents: revealExtras ? 'auto' : 'none',
            transition: 'max-height 280ms ease, opacity 220ms ease',
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        >
          <SuggestedPromptsSwiper onSelectPrompt={handleSelectPrompt} disabled={awaitingReply} />
        </Box>
      }
      composer={
        <ChatComposer
          onSubmit={handleSubmit}
          placeholder="Pergunte ao Findu…"
        />
      }
    />
  );
}
