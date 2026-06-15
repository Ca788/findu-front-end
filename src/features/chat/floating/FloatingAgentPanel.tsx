'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNewOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';
import Link from 'next/link';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useFloatingAgent } from '@/contexts/FloatingAgentContext';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useConversationMessages } from '@/features/chat/hooks/useConversationMessages';
import { useCreateConversation } from '@/features/chat/hooks/useCreateConversation';
import { useUpdateConversation } from '@/features/chat/hooks/useUpdateConversation';
import { AgentSelector } from '@/features/chat/floating/AgentSelector';
import { FloatingMessages } from '@/features/chat/floating/FloatingMessages';
import { FloatingComposer } from '@/features/chat/floating/FloatingComposer';
import type { AgentId } from '@/features/chat/models/agent.model';

export function FloatingAgentPanel() {
  const {
    open,
    conversationId,
    selectedAgentId,
    setOpen,
    setConversationId,
    setSelectedAgentId,
  } = useFloatingAgent();

  const conversationsQuery = useConversations({ page: 1, perPage: 1 });
  const createConversation = useCreateConversation();
  const updateConversation = useUpdateConversation();

  useEffect(() => {
    if (!open || conversationId) return;

    const latest = conversationsQuery.data?.data?.[0];
    if (latest) {
      setConversationId(latest.id);
      if (latest.agent_id) setSelectedAgentId(latest.agent_id);
      return;
    }

    if (
      !conversationsQuery.isLoading &&
      !conversationsQuery.isFetching &&
      !createConversation.isPending
    ) {
      createConversation.mutate(
        { title: 'Conversa rápida' },
        { onSuccess: (conversation) => setConversationId(conversation.id) },
      );
    }
  }, [
    open,
    conversationId,
    conversationsQuery.data,
    conversationsQuery.isLoading,
    conversationsQuery.isFetching,
    createConversation,
    setConversationId,
    setSelectedAgentId,
  ]);

  const { messages, status } = useConversationMessages(open ? conversationId ?? undefined : undefined);

  const handleSelectAgent = (agentId: AgentId | null) => {
    setSelectedAgentId(agentId);
    if (conversationId) {
      updateConversation.mutate({ id: conversationId, agent_id: agentId });
    }
  };

  const handleNewConversation = () => {
    createConversation.mutate(
      { title: 'Conversa rápida', agent_id: selectedAgentId },
      { onSuccess: (conversation) => setConversationId(conversation.id) },
    );
  };

  if (!open) return null;

  const isLoadingMessages = status === 'loading';
  const isProvisioning = !conversationId && (createConversation.isPending || conversationsQuery.isFetching);

  return (
    <Paper
      elevation={12}
      sx={(theme) => ({
        position: 'fixed',
        bottom: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        width: { xs: 'calc(100vw - 32px)', sm: 380, md: 420 },
        height: { xs: 'calc(100vh - 96px)', sm: 560, md: 620 },
        maxHeight: 'calc(100vh - 32px)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        zIndex: theme.zIndex.modal,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: `0 24px 48px -12px ${theme.palette.common.black}66, 0 0 0 1px ${theme.palette.primary.main}22`,
      })}
    >
      <header className="flex items-center gap-2 border-b border-(--mui-palette-divider) px-3 py-2.5">
        <div className="flex flex-col flex-1 min-w-0">
          <Typography variant="subtitle2" className="font-semibold leading-tight">
            Findu Agentes
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {selectedAgentId ? `Modo: ${selectedAgentId}` : 'Modo automático'}
          </Typography>
        </div>
        <Tooltip title="Nova conversa">
          <span>
            <IconButton size="small" onClick={handleNewConversation} disabled={createConversation.isPending}>
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Abrir página completa">
          <IconButton
            size="small"
            component={Link}
            href={conversationId ? `${AppRoutePaths.CHAT}/${conversationId}` : AppRoutePaths.CHAT}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Fechar">
          <IconButton size="small" onClick={() => setOpen(false)} aria-label="Fechar chat flutuante">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </header>

      <div className="px-3 pt-2.5 pb-1.5">
        <AgentSelector
          selectedAgentId={selectedAgentId}
          onSelect={handleSelectAgent}
          disabled={!conversationId || updateConversation.isPending}
        />
      </div>

      {(isProvisioning || isLoadingMessages) && <LinearProgress />}

      <FloatingMessages messages={messages} isLoading={isLoadingMessages} />

      {conversationId ? (
        <FloatingComposer conversationId={conversationId} />
      ) : (
        <div className="flex items-center justify-center px-4 py-3 border-t border-(--mui-palette-divider)">
          <Typography variant="caption" color="text.secondary">
            Preparando conversa…
          </Typography>
        </div>
      )}
    </Paper>
  );
}
