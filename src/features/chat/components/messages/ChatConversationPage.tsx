'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppErrorResultMapper, type ErrorResponse } from '@/infrastructure/AppResponse';
import { useConversation } from '@/features/chat/hooks/useConversation';
import { useConversationMessages } from '@/features/chat/hooks/useConversationMessages';
import { useCreateConversation } from '@/features/chat/hooks/useCreateConversation';
import {
  buildOptimisticMessage,
  createClientId,
  stashPendingSend,
  takePendingSend,
  useSendMessage,
} from '@/features/chat/hooks/useSendMessage';
import { MessagesList } from '@/features/chat/components/messages/MessagesList';
import { ChatComposer } from '@/features/chat/components/screen/ChatComposer';
import { ChatGreeting } from '@/features/chat/components/screen/ChatGreeting';
import { ChatLayout } from '@/features/chat/components/screen/ChatLayout';
import { SuggestedPromptsSwiper } from '@/features/chat/components/screen/SuggestedPromptsSwiper';
import type { ChatSuggestedPrompt } from '@/features/chat/constants/chatSuggestedPrompts';
import type {
  ChatMessage,
  MessageAction,
  SendMessageInput,
} from '@/features/chat/models/message.model';

const ACTION_IDLE_MS = 8000;

interface ChatConversationPageProps {
  conversationId?: string;
}

export function ChatConversationPage({ conversationId: initialId }: ChatConversationPageProps) {
  const router = useRouter();
  const { showError } = useSnackbar();
  const [conversationId, setConversationId] = useState(initialId);
  const createConversation = useCreateConversation();
  useConversation(conversationId);
  const { messages, status, addOptimistic, markOptimisticFailed } =
    useConversationMessages(conversationId);
  const { send } = useSendMessage(conversationId ?? '', {
    onOptimistic: addOptimistic,
    onOptimisticFailed: (clientMessageId) => {
      markOptimisticFailed(clientMessageId);
      showError('Erro ao enviar mensagem');
    },
  });

  useEffect(() => {
    if (!conversationId) return;
    const pending = takePendingSend(conversationId);
    if (!pending) return;
    void send(pending, { skipOptimistic: true });
  }, [conversationId, send]);

  const startConversation = useCallback(
    async (input: SendMessageInput): Promise<ChatMessage | void> => {
      const payload: SendMessageInput = {
        ...input,
        client_message_id: input.client_message_id || createClientId(),
      };
      const draft = buildOptimisticMessage('pending', payload);
      addOptimistic(draft);

      try {
        const conversation = await createConversation.mutateAsync({});
        stashPendingSend(conversation.id, payload, draft);
        setConversationId(conversation.id);
        window.history.replaceState(null, '', AppRoutePaths.chatConversation(conversation.id));
        return draft;
      } catch (err) {
        markOptimisticFailed(draft.client_message_id as string);
        const mapped = AppErrorResultMapper.fromAxiosError(err as AxiosError<ErrorResponse>);
        showError(mapped.data.message ?? 'Erro ao iniciar conversa');
      }
    },
    [addOptimistic, createConversation, markOptimisticFailed, showError],
  );

  const handleSubmit = useCallback(
    (input: SendMessageInput) => (conversationId ? send(input) : startConversation(input)),
    [conversationId, send, startConversation],
  );

  const handleSelectPrompt = useCallback(
    (prompt: ChatSuggestedPrompt) => {
      void handleSubmit({ body: prompt.message });
    },
    [handleSubmit],
  );

  const handleAction = useCallback(
    (action: MessageAction) => {
      switch (action.kind) {
        case 'send_message':
          if (action.message) void handleSubmit({ body: action.message });
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
    [router, handleSubmit],
  );

  const isLoading = status === 'loading' && messages.length === 0;
  const isFresh = !conversationId && messages.length === 0;
  const lastMessage = messages[messages.length - 1];
  const awaitingReply =
    lastMessage?.role === 'user' && lastMessage.status !== 'failed';
  const lastIsStreaming =
    lastMessage?.role === 'assistant' &&
    (lastMessage.status === 'pending' || lastMessage.status === 'processing');
  const chatBusy = awaitingReply || lastIsStreaming;
  const [busy, setBusy] = useState(chatBusy);
  const [revealExtras, setRevealExtras] = useState(!chatBusy);

  if (busy !== chatBusy) {
    setBusy(chatBusy);
    if (chatBusy) setRevealExtras(false);
  }

  useEffect(() => {
    if (chatBusy) return;
    const timer = window.setTimeout(() => setRevealExtras(true), ACTION_IDLE_MS);
    return () => window.clearTimeout(timer);
  }, [chatBusy, messages.length]);

  return (
    <ChatLayout
      messages={
        isFresh ? (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 1.5, md: 3 },
              py: 2,
            }}
          >
            <ChatGreeting />
          </Box>
        ) : (
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
        )
      }
      suggestions={
        isFresh ? <SuggestedPromptsSwiper onSelectPrompt={handleSelectPrompt} /> : undefined
      }
      composer={
        <ChatComposer
          onSubmit={handleSubmit}
          isSending={createConversation.isPending}
          placeholder="Pergunte ao Findu…"
        />
      }
    />
  );
}
