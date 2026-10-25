import { keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  getNotificationPreferences,
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPreferences,
  type ListNotificationsParams,
} from '@/features/notifications/gateway/notifications.gateway';
import type {
  AppNotification,
  NotificationPreferences,
} from '@/features/notifications/models/notification.model';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';

export const NOTIFICATIONS_LIST_KEY = 'notifications:list';
export const NOTIFICATIONS_UNREAD_KEY = 'notifications:unread';
const NOTIFICATIONS_PREFERENCES_KEY = 'notifications:preferences';

export function useNotifications(params: ListNotificationsParams, enabled = true) {
  return useAppQuery<PaginatedSuccessResponse<AppNotification>>({
    queryKey: [NOTIFICATIONS_LIST_KEY, params],
    queryFn: () => listNotifications(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled,
  });
}

export function useUnreadCount() {
  return useAppQuery<number>({
    queryKey: [NOTIFICATIONS_UNREAD_KEY],
    queryFn: getUnreadCount,
    staleTime: 60_000,
  });
}

export function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return useCallback(
    (unreadCount?: number) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_LIST_KEY] });
      if (unreadCount === undefined) {
        queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_UNREAD_KEY] });
      } else {
        queryClient.setQueryData([NOTIFICATIONS_UNREAD_KEY], unreadCount);
      }
    },
    [queryClient],
  );
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => invalidate(),
  });
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => invalidate(0),
  });
}

export function useNotificationPreferences() {
  return useAppQuery<NotificationPreferences>({
    queryKey: [NOTIFICATIONS_PREFERENCES_KEY],
    queryFn: getNotificationPreferences,
    staleTime: 5 * 60_000,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groups: Parameters<typeof updateNotificationPreferences>[0]) =>
      updateNotificationPreferences(groups),
    onSuccess: (groups) => queryClient.setQueryData([NOTIFICATIONS_PREFERENCES_KEY], groups),
  });
}
