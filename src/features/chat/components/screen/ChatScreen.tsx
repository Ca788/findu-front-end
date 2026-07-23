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
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';
import { useDevice } from '@/hooks/useDevice';
import type { ChatSuggestedPrompt } from '@/features/chat/constants/chatSuggestedPrompts';
import type { SendMessageInput } from '@/features/chat/models/message.model';

export function ChatScreen() {
  const router = useRouter();
  const { showError } = useSnackbar();
  const { keyboardOpen } = useAppShell();
  const { isMobile } = useDevice();
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
    <Box
      className="findu-aurora-glow"
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {isStarting && <LinearProgress />}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 1.5, md: 3 },
          py: 2,
        }}
      >
        <ChatGreeting onSelectPrompt={handleSelectPrompt} disabled={isStarting} />
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider',
          paddingBottom:
            isMobile && !keyboardOpen
              ? 'var(--app-bottom-nav-space)'
              : 'var(--app-safe-bottom)',
        }}
      >
        <Box
          sx={{
            mx: 'auto',
            width: '100%',
            maxWidth: 760,
            px: { xs: 0, sm: 1.5 },
          }}
        >
          <ChatComposer
            onSubmit={handleSubmit}
            isSending={isStarting}
            placeholder="Pergunte ao Findu…"
          />
        </Box>
      </Box>
    </Box>
  );
}
