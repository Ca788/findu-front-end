'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/CloseRounded';
import DoneAllIcon from '@mui/icons-material/DoneAllRounded';
import TuneIcon from '@mui/icons-material/TuneRounded';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useDevice } from '@/hooks/useDevice';
import { EmptyState } from '@/components/common/EmptyState';
import { NotificationItem } from '@/features/notifications/components/NotificationItem';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/features/notifications/hooks/useNotifications';
import type { AppNotification } from '@/features/notifications/models/notification.model';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const PER_PAGE = 20;

export function NotificationsDrawer({ open, onClose }: NotificationsDrawerProps) {
  const { isMobile } = useDevice();
  const [page, setPage] = useState(1);
  const query = useNotifications({ page, perPage: PER_PAGE }, open);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const notifications = query.data?.data ?? [];
  const unreadCount = Number(query.data?.metadata?.unread_count ?? 0);
  const pagination = query.data?.pagination;

  const handleOpen = (notification: AppNotification) => {
    if (!notification.read) markRead.mutate(notification.id);
    onClose();
  };

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: isMobile ? '100%' : 400,
            maxHeight: isMobile ? '85dvh' : '100%',
            borderRadius: isMobile ? '20px 20px 0 0' : 0,
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
          Notificações
        </Typography>
        <Tooltip title="Marcar todas como lidas">
          <span>
            <IconButton
              size="small"
              disabled={unreadCount === 0 || markAll.isPending}
              onClick={() => markAll.mutate()}
              aria-label="Marcar todas como lidas"
            >
              <DoneAllIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Preferências">
          <IconButton
            size="small"
            component={Link}
            href={`${AppRoutePaths.PROFILE}#notificacoes`}
            onClick={onClose}
            aria-label="Preferências de notificação"
          >
            <TuneIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <IconButton size="small" onClick={onClose} aria-label="Fechar">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 1, pb: 2 }}>
        {query.isLoading ? (
          <Stack spacing={1} sx={{ px: 1 }}>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} variant="rounded" height={72} sx={{ borderRadius: '14px' }} />
            ))}
          </Stack>
        ) : notifications.length === 0 ? (
          <Box sx={{ px: 1, py: 4 }}>
            <EmptyState
              illustration="umbrella"
              title="Tudo em dia"
              description="Quando algo pedir sua atenção, aparece aqui."
              size={96}
            />
          </Box>
        ) : (
          <Stack spacing={0.5}>
            {notifications.map((notification, index) => (
              <Box
                key={notification.id}
                className="findu-anim-rise"
                style={{ '--findu-delay': `${index * 40}ms` } as CSSProperties}
              >
                <NotificationItem notification={notification} onOpen={handleOpen} />
              </Box>
            ))}
          </Stack>
        )}

        {pagination && pagination.totalPages > 1 && (
          <Stack direction="row" sx={{ justifyContent: 'center', gap: 1, pt: 2 }}>
            <Button size="small" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Mais recentes
            </Button>
            <Button
              size="small"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Mais antigas
            </Button>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}
