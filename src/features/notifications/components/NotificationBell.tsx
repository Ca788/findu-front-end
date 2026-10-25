'use client';

import { useCallback, useState } from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { NotificationsDrawer } from '@/features/notifications/components/NotificationsDrawer';
import { useUnreadCount } from '@/features/notifications/hooks/useNotifications';
import { useNotificationsChannel } from '@/features/notifications/hooks/useNotificationsChannel';
import { usePushRegistration } from '@/features/notifications/hooks/usePushRegistration';
import type { AppNotification } from '@/features/notifications/models/notification.model';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { showInfo } = useSnackbar();
  const { data: unreadCount = 0 } = useUnreadCount();

  const onCreated = useCallback(
    (notification: AppNotification) => showInfo(notification.title),
    [showInfo],
  );
  useNotificationsChannel(onCreated);
  usePushRegistration();
  usePushRegistration();

  return (
    <>
      <Tooltip title="Notificações">
        <IconButton
          onClick={() => setOpen(true)}
          aria-label={unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Notificações'}
          size="medium"
          className={unreadCount > 0 ? 'findu-bell-alert' : undefined}
        >
          <Badge
            badgeContent={unreadCount}
            max={99}
            color="error"
            overlap="circular"
            sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: 10, minWidth: 18, height: 18 } }}
          >
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
