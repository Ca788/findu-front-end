'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/AddOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useArchiveConversation } from '@/features/chat/hooks/useArchiveConversation';
import { formatDateTimeBR } from '@/utils/date';
import type { Conversation } from '@/features/chat/models/conversation.model';

function conversationTitle(conversation: Conversation): string {
  if (conversation.title?.trim()) return conversation.title.trim();
  return `Conversa · ${formatDateTimeBR(conversation.created_at)}`;
}

export function ChatPage() {
  const [archiveTarget, setArchiveTarget] = useState<Conversation | undefined>();
  const { showSuccess, showError } = useSnackbar();

  const { data, isLoading, isFetching, isError } = useConversations({ perPage: 40 });
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
    <Stack spacing={2.5}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, letterSpacing: 0.04 }}
          >
            Recentes
          </Typography>
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 650, letterSpacing: '-0.03em', mt: 0.25 }}
          >
            Conversas
          </Typography>
        </Box>
        <Button
          component={Link}
          href={AppRoutePaths.CHAT}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 999 }}
        >
          Nova
        </Button>
      </Box>

      {isError && <Alert severity="error">Erro ao carregar conversas.</Alert>}
      {isFetching && <LinearProgress />}

      {!isLoading && conversations.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          Nenhuma conversa ainda.
        </Typography>
      )}

      <List disablePadding sx={{ mx: -1 }}>
        {conversations.map((conversation) => (
          <ListItemButton
            key={conversation.id}
            component={Link}
            href={AppRoutePaths.chatConversation(conversation.id)}
            onContextMenu={(event) => {
              event.preventDefault();
              setArchiveTarget(conversation);
            }}
            sx={{
              borderRadius: 2,
              px: 1.5,
              py: 1.25,
            }}
          >
            <ListItemText
              primary={conversationTitle(conversation)}
              secondary={formatDateTimeBR(conversation.updated_at)}
              slotProps={{
                primary: {
                  noWrap: true,
                  sx: { fontWeight: 500, fontSize: 15 },
                },
                secondary: { sx: { fontSize: 12 } },
              }}
            />
          </ListItemButton>
        ))}
      </List>

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
