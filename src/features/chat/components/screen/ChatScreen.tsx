'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { useCreateConversation } from '@/features/chat/hooks/useCreateConversation';
import { sendMessage } from '@/features/chat/gateway/messages.gateway';
import { ChatComposer } from '@/features/chat/components/screen/ChatComposer';
import { ChatGreeting } from '@/features/chat/components/screen/ChatGreeting';
import { ChatLayout } from '@/features/chat/components/screen/ChatLayout';
import { SuggestedPromptsSwiper } from '@/features/chat/components/screen/SuggestedPromptsSwiper';
import type { ChatSuggestedPrompt } from '@/features/chat/constants/chatSuggestedPrompts';
import type { SendMessageInput } from '@/features/chat/models/message.model';

export function ChatScreen() {
  const router = useRouter();
  const { showError } = useSnackbar();
  const [isStarting, setIsStarting] = useState(false);
  const createConversation = useCreateConversation();

  const handleSubmit = async (input: SendMessageInput) => {
    setIsStarting(true);
    try {
      const conversation = await createConversation.mutateAsync({});
      const message = await sendMessage(conversation.id, input);
      router.replace(AppRoutePaths.chatConversation(conversation.id));
      return message;
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao iniciar conversa');
      throw err;
    } finally {
      setIsStarting(false);
    }
  };

  const handleSelectPrompt = (prompt: ChatSuggestedPrompt) => {
    if (isStarting) return;
    void handleSubmit({ body: prompt.message });
  };

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {isStarting && (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />
      )}
      <ChatLayout
        messages={
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
        }
        suggestions={
          <SuggestedPromptsSwiper onSelectPrompt={handleSelectPrompt} disabled={isStarting} />
        }
        composer={
          <ChatComposer
            onSubmit={handleSubmit}
            isSending={isStarting}
            placeholder="Pergunte ao Findu…"
          />
        }
      />
    </Box>
  );
}
