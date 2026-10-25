'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import {
  formatRelativeTime,
  notificationHref,
  NOTIFICATION_GROUP_PRESENTATION,
} from '@/features/notifications/components/notificationPresentation';
import type { AppNotification } from '@/features/notifications/models/notification.model';

interface NotificationItemProps {
  notification: AppNotification;
  onOpen: (notification: AppNotification) => void;
}

export function NotificationItem({ notification, onOpen }: NotificationItemProps) {
  const { icon: Icon, color } = NOTIFICATION_GROUP_PRESENTATION[notification.group];

  return (
    <ButtonBase
      component={Link}
      href={notificationHref(notification.data)}
      onClick={() => onOpen(notification)}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        width: '100%',
        textAlign: 'left',
        px: 2,
        py: 1.5,
        borderRadius: '14px',
        bgcolor: notification.read ? 'transparent' : alpha(color, 0.06),
        transition: 'background-color 160ms ease',
        '&:hover': { bgcolor: alpha(color, 0.1) },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          color,
          bgcolor: alpha(color, 0.14),
        }}
      >
        <Icon sx={{ fontSize: 22 }} />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: notification.read ? 500 : 700, lineHeight: 1.3 }}
        >
          {notification.title}
        </Typography>
        {notification.body && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {notification.body}
          </Typography>
        )}
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
          {formatRelativeTime(notification.created_at)}
        </Typography>
      </Box>
      {!notification.read && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: color,
            mt: 1,
            flexShrink: 0,
          }}
        />
      )}
    </ButtonBase>
  );
}
