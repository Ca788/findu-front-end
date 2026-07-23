'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/AddRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useArchiveConversation } from '@/features/chat/hooks/useArchiveConversation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { formatDateTimeBR } from '@/utils/date';
import type { Conversation } from '@/features/chat/models/conversation.model';

interface RecentConversationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

function conversationTitle(conversation: Conversation): string {
  if (conversation.title?.trim()) return conversation.title.trim();
  return `Conversa · ${formatDateTimeBR(conversation.created_at)}`;
}

export function RecentConversationsDrawer({
  open,
  onClose,
}: RecentConversationsDrawerProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { data, isLoading, isError } = useConversations({ perPage: 30 });
  const archiveMutation = useArchiveConversation();
  const { showError, showSuccess } = useSnackbar();
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const conversations = data?.data ?? [];

  const openConversation = (id: string) => {
    onClose();
    router.push(AppRoutePaths.chatConversation(id));
  };

  const handleArchive = async (conversation: Conversation) => {
    setArchivingId(conversation.id);
    try {
      await archiveMutation.mutateAsync(conversation.id);
      showSuccess('Conversa arquivada');
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao arquivar');
    } finally {
      setArchivingId(null);
    }
  };

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      onOpen={() => undefined}
      disableSwipeToOpen
      slotProps={{
        paper: {
          sx: {
            width: 'min(86vw, 340px)',
            bgcolor: 'background.default',
            backgroundImage: 'none',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          pt: 'calc(12px + var(--app-safe-top))',
          pb: 1.5,
        }}
      >
        <Typography sx={{ flex: 1, fontWeight: 600, fontSize: '1.15rem' }}>
          Findu
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Fechar">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 2, pb: 1.5 }}>
        <Box
          component={Link}
          href={AppRoutePaths.CHAT}
          onClick={onClose}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.5,
            py: 0.85,
            borderRadius: 999,
            textDecoration: 'none',
            color: 'text.primary',
            bgcolor: 'action.hover',
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          Nova conversa
        </Box>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2.25, pb: 0.75, fontWeight: 600, letterSpacing: 0.04 }}
      >
        Recentes
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {isLoading && (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
            <CircularProgress size={22} />
          </Box>
        )}
        {isError && (
          <Typography variant="body2" color="error" sx={{ px: 2, py: 2 }}>
            Não foi possível carregar as conversas.
          </Typography>
        )}
        {!isLoading && !isError && conversations.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2.25, py: 2 }}>
            Nenhuma conversa ainda.
          </Typography>
        )}
        <List disablePadding>
          {conversations.map((conversation) => (
            <ListItemButton
              key={conversation.id}
              onClick={() => openConversation(conversation.id)}
              onContextMenu={(event) => {
                event.preventDefault();
                void handleArchive(conversation);
              }}
              disabled={archivingId === conversation.id}
              sx={{
                px: 2.25,
                py: 1.1,
                alignItems: 'flex-start',
              }}
            >
              <ListItemText
                primary={conversationTitle(conversation)}
                slotProps={{
                  primary: {
                    noWrap: true,
                    sx: { fontSize: 14.5, fontWeight: 500 },
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2,
          py: 1.5,
          pb: 'calc(12px + var(--app-safe-bottom))',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {(user?.name ?? 'U').trim().charAt(0).toUpperCase()}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ fontWeight: 600, fontSize: 14 }}>
            {user?.name ?? 'Conta'}
          </Typography>
          <Typography noWrap variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <IconButton
          component={Link}
          href={AppRoutePaths.PROFILE}
          onClick={onClose}
          size="small"
          aria-label="Conta"
        >
          <SettingsOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </SwipeableDrawer>
  );
}
