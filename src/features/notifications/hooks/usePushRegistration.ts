import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvalidateNotifications } from '@/features/notifications/hooks/useNotifications';
import { notificationHref } from '@/features/notifications/components/notificationPresentation';
import { startPush } from '@/features/notifications/services/push.service';
import { markNotificationRead } from '@/features/notifications/gateway/notifications.gateway';

export function usePushRegistration() {
  const router = useRouter();
  const invalidate = useInvalidateNotifications();

  useEffect(() => {
    let dispose: (() => void) | null = null;
    let active = true;

    startPush({
      onReceived: () => invalidate(),
      onOpen: (data) => {
        if (data.notification_id) void markNotificationRead(data.notification_id).then(() => invalidate());
        router.push(notificationHref(data));
      },
    }).then((cleanup) => {
      if (active) dispose = cleanup;
      else cleanup();
    });

    return () => {
      active = false;
      dispose?.();
    };
  }, [invalidate, router]);
}
