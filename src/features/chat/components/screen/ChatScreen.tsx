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
import { AgentSegmentedControl } from '@/features/chat/components/screen/AgentSegmentedControl';
import { ChatComposer } from '@/features/chat/components/screen/ChatComposer';
import { ChatGreeting } from '@/features/chat/components/screen/ChatGreeting';
import type { AgentId } from '@/features/chat/models/agent.model';
import type { SendMessageInput } from '@/features/chat/models/message.model';

export function ChatScreen() {
  const router = useRouter();
  const { showError } = useSnackbar();
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const createConversation = useCreateConversation();

  const handleSubmit = async (input: SendMessageInput) => {
    setIsStarting(true);
    try {
      const conversation = await createConversation.mutateAsync({
        agent_id: selectedAgentId,
      });
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
      <Box sx={{ flexShrink: 0, px: { xs: 1.5, md: 3 }, py: 1 }}>
        <Box
          sx={{
            mx: 'auto',
            width: '100%',
            maxWidth: 880,
            px: { xs: 0.5, md: 1 },
          }}
        >
          <AgentSegmentedControl
            selectedAgentId={selectedAgentId}
            onSelect={setSelectedAgentId}
            disabled={isStarting}
          />
        </Box>
      </Box>

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
          gap: { xs: 2.5, md: 3.5 },
          px: { xs: 1.5, md: 3 },
          pt: 4,
          pb: {
            xs: 'calc(1.5rem + var(--app-bottom-nav-space))',
            sm: 4,
          },
        }}
      >
        <ChatGreeting />
        <Box
          className="findu-anim-fade-in-soft"
          sx={{
            width: '100%',
            maxWidth: 760,
          }}
        >
          <ChatComposer
            onSubmit={handleSubmit}
            isSending={isStarting}
            placeholder="Pergunte ao Findu..."
          />
        </Box>
      </Box>
    </Box>
  );
}
