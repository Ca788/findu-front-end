'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Box from '@mui/material/Box';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { useCreateConversation } from '@/features/chat/hooks/useCreateConversation';
import {
  buildOptimisticMessage,
  createClientId,
  stashPendingSend,
} from '@/features/chat/hooks/useSendMessage';
import { ChatComposer } from '@/features/chat/components/screen/ChatComposer';
import { ChatGreeting } from '@/features/chat/components/screen/ChatGreeting';
import { ChatLayout } from '@/features/chat/components/screen/ChatLayout';
import { MessagesList } from '@/features/chat/components/messages/MessagesList';
import { SuggestedPromptsSwiper } from '@/features/chat/components/screen/SuggestedPromptsSwiper';
import type { ChatSuggestedPrompt } from '@/features/chat/constants/chatSuggestedPrompts';
import type { ChatMessage, SendMessageInput } from '@/features/chat/models/message.model';

export function ChatScreen() {
  const router = useRouter();
  const { showError } = useSnackbar();
  const [outgoing, setOutgoing] = useState<ChatMessage | null>(null);
  const createConversation = useCreateConversation();

  const handleSubmit = async (input: SendMessageInput) => {
    if (outgoing) return outgoing;

    const payload: SendMessageInput = {
      ...input,
      client_message_id: input.client_message_id || createClientId(),
    };
    const draft = buildOptimisticMessage('pending', payload);
    setOutgoing(draft);

    try {
      const conversation = await createConversation.mutateAsync({});
      stashPendingSend(conversation.id, payload, draft);
      router.replace(AppRoutePaths.chatConversation(conversation.id));
      return draft;
    } catch (err) {
      setOutgoing(null);
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao iniciar conversa');
    }
  };

  const handleSelectPrompt = (prompt: ChatSuggestedPrompt) => {
    if (outgoing) return;
    void handleSubmit({ body: prompt.message });
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ChatLayout
        messages={
          outgoing ? (
            <MessagesList
              messages={[outgoing]}
              isLoading={false}
              awaitingReply
              revealActions={false}
            />
          ) : (
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
          )
        }
        suggestions={
          outgoing ? undefined : (
            <SuggestedPromptsSwiper onSelectPrompt={handleSelectPrompt} />
          )
        }
        composer={
          <ChatComposer
            onSubmit={handleSubmit}
            isSending={!!outgoing}
            placeholder="Pergunte ao Findu…"
          />
        }
      />
    </Box>
  );
}
