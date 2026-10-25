import { useEffect } from 'react';
import { getCableConsumer } from '@/infrastructure/cable.client';
import { useInvalidateNotifications } from '@/features/notifications/hooks/useNotifications';
import type { AppNotification } from '@/features/notifications/models/notification.model';

type NotificationsEvent =
  | { type: 'notification.created'; notification: AppNotification; unread_count: number }
  | { type: 'notifications.read'; unread_count: number };

export function useNotificationsChannel(onCreated?: (notification: AppNotification) => void) {
  const invalidate = useInvalidateNotifications();

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let subscription: { unsubscribe: () => void } | null = null;

    const subscribe = () => {
      if (!active) return;
      const consumer = getCableConsumer();
      if (!consumer) {
        retryTimer = setTimeout(subscribe, 1000);
        return;
      }

      subscription = consumer.subscriptions.create(
        { channel: 'NotificationsChannel' },
        {
          received(event: NotificationsEvent) {
            if (!active) return;
            invalidate(event.unread_count);
            if (event.type === 'notification.created') onCreated?.(event.notification);
          },
        },
      );
    };

    subscribe();

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
      subscription?.unsubscribe();
    };
  }, [invalidate, onCreated]);
}
