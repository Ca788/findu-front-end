'use client';

import { useCallback, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useConversation } from '@/features/chat/hooks/useConversation';
import { useConversationMessages } from '@/features/chat/hooks/useConversationMessages';
import { useUpdateConversation } from '@/features/chat/hooks/useUpdateConversation';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { ChatConversationHeader } from '@/features/chat/components/messages/ChatConversationHeader';
import { MessagesList } from '@/features/chat/components/messages/MessagesList';
import { AgentSegmentedControl } from '@/features/chat/components/screen/AgentSegmentedControl';
import { ChatComposer } from '@/features/chat/components/screen/ChatComposer';
import { ChatLayout } from '@/features/chat/components/screen/ChatLayout';
import type { AgentId } from '@/features/chat/models/agent.model';
import type { SendMessageInput } from '@/features/chat/models/message.model';

interface ChatConversationPageProps {
  conversationId: string;
}

export function ChatConversationPage({ conversationId }: ChatConversationPageProps) {
  const { data: conversation } = useConversation(conversationId);
  const { messages, status } = useConversationMessages(conversationId);
  const updateConversation = useUpdateConversation();
  const { send, isSending } = useSendMessage(conversationId);

  const [pendingAgentId, setPendingAgentId] = useState<AgentId | null>(null);
  const activeAgentId = pendingAgentId ?? conversation?.agent_id ?? null;

  const handleSelectAgent = (agentId: AgentId | null) => {
    setPendingAgentId(agentId);
    updateConversation.mutate(
      { id: conversationId, agent_id: agentId },
      { onSettled: () => setPendingAgentId(null) },
    );
  };

  const handleSubmit = useCallback(
    (input: SendMessageInput) => send(input),
    [send],
  );

  const title = conversation?.title?.trim() || 'Conversa';
  const isLoading = status === 'loading';

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
            gap: 0.75,
            px: { xs: 0.5, md: 1 },
          }}
        >
          <ChatConversationHeader title={title} />
          <AgentSegmentedControl
            selectedAgentId={activeAgentId}
            onSelect={handleSelectAgent}
            disabled={updateConversation.isPending}
          />
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
          <MessagesList messages={messages} isLoading={isLoading} />
        </>
      }
      composer={<ChatComposer onSubmit={handleSubmit} isSending={isSending} />}
    />
  );
}
