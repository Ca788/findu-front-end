'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { NOTIFICATION_GROUP_PRESENTATION } from '@/features/notifications/components/notificationPresentation';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/features/notifications/hooks/useNotifications';
import {
  NOTIFICATION_CHANNEL_LABELS,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_GROUP_LABELS,
  NOTIFICATION_GROUPS,
  type NotificationChannel,
  type NotificationGroup,
} from '@/features/notifications/models/notification.model';

export function NotificationPreferences() {
  const { data, isLoading } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();

  const toggle = (group: NotificationGroup, channel: NotificationChannel, enabled: boolean) =>
    update.mutate({ [group]: { [channel]: enabled } });

  if (isLoading || !data) {
    return (
      <Stack spacing={1}>
        {NOTIFICATION_GROUPS.map((group) => (
          <Skeleton key={group} variant="rounded" height={64} sx={{ borderRadius: '14px' }} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      {NOTIFICATION_GROUPS.map((group) => {
        const { icon: Icon, color } = NOTIFICATION_GROUP_PRESENTATION[group];
        const { label, description } = NOTIFICATION_GROUP_LABELS[group];

        return (
          <Box
            key={group}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                display: 'grid',
                placeItems: 'center',
                color,
                bgcolor: alpha(color, 0.14),
                flexShrink: 0,
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            </Box>
            <Stack direction="row" sx={{ gap: 0.5, flexShrink: 0 }}>
              {NOTIFICATION_CHANNELS.map((channel) => (
                <Stack key={channel} sx={{ alignItems: 'center' }}>
                  <Switch
                    size="small"
                    checked={data[group][channel]}
                    onChange={(_, checked) => toggle(group, channel, checked)}
                    disabled={update.isPending}
                    slotProps={{ input: { 'aria-label': `${label}: ${NOTIFICATION_CHANNEL_LABELS[channel]}` } }}
                  />
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
                    {channel === 'in_app' ? 'App' : 'Push'}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
