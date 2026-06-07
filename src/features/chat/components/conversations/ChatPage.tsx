'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/AddOutlined';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useArchiveConversation } from '@/features/chat/hooks/useArchiveConversation';
import { ChatList } from '@/features/chat/components/conversations/ChatList';
import { NewConversationDialog } from '@/features/chat/components/conversations/NewConversationDialog';
import type { Conversation } from '@/features/chat/models/conversation.model';

export function ChatPage() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<Conversation | undefined>();
  const { showSuccess, showError } = useSnackbar();

  const { data, isLoading, isFetching, isError } = useConversations();
  const archiveMutation = useArchiveConversation();

  const conversations = data?.data ?? [];

  const handleArchive = async () => {
    if (!archiveTarget) return;
    try {
      await archiveMutation.mutateAsync(archiveTarget.id);
      showSuccess('Conversa arquivada');
      setArchiveTarget(undefined);
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao arquivar');
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Assistente"
        title="Conversas"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            className="w-full sm:w-auto"
          >
            Nova conversa
          </Button>
        }
      />

      {isError && <Alert severity="error">Erro ao carregar conversas.</Alert>}
      {isFetching && <LinearProgress />}

      <ChatList
        conversations={conversations}
        isLoading={isLoading}
        onArchive={setArchiveTarget}
      />

      <NewConversationDialog
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
      />
      <ConfirmDialog
        open={!!archiveTarget}
        title="Arquivar conversa"
        description="A conversa será arquivada e não aparecerá na lista. Deseja continuar?"
        confirmLabel="Arquivar"
        confirmColor="warning"
        isLoading={archiveMutation.isPending}
        onClose={() => setArchiveTarget(undefined)}
        onConfirm={handleArchive}
      />
    </Stack>
  );
}
