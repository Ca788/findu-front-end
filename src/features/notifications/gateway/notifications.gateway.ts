import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type {
  AppNotification,
  NotificationPreferences,
} from '@/features/notifications/models/notification.model';

const BASE_PATH = '/notifications';

export interface ListNotificationsParams {
  page?: number;
  perPage?: number;
  unread?: boolean;
}

export async function listNotifications(
  params?: ListNotificationsParams,
): Promise<PaginatedSuccessResponse<AppNotification>> {
  const response = await authorizedApiClient.get<PaginatedSuccessResponse<AppNotification>>(
    BASE_PATH,
    {
      params: {
        page: params?.page ?? 1,
        perPage: params?.perPage ?? 20,
        unread: params?.unread ? 'true' : undefined,
      },
    },
  );
  return response.data;
}

export async function getUnreadCount(): Promise<number> {
  const response = await authorizedApiClient.get<SuccessResponse<{ unread_count: number }>>(
    `${BASE_PATH}/unread_count`,
  );
  return response.data.data.unread_count;
}

export async function markNotificationRead(id: string): Promise<AppNotification> {
  const response = await authorizedApiClient.post<SuccessResponse<AppNotification>>(
    `${BASE_PATH}/${id}/read`,
  );
  return response.data.data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await authorizedApiClient.post(`${BASE_PATH}/read_all`);
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await authorizedApiClient.get<SuccessResponse<{ groups: NotificationPreferences }>>(
    `${BASE_PATH}/preferences`,
  );
  return response.data.data.groups;
}

export async function registerDevice(token: string, platform: string): Promise<void> {
  await authorizedApiClient.post(`${BASE_PATH}/devices`, { token, platform });
}

export async function unregisterDevice(token: string): Promise<void> {
  await authorizedApiClient.delete(`${BASE_PATH}/devices`, {
    data: { token },
    skipAuthHandler: true,
  });
}

export async function updateNotificationPreferences(
  groups: Partial<Record<string, Partial<Record<string, boolean>>>>,
): Promise<NotificationPreferences> {
  const response = await authorizedApiClient.put<SuccessResponse<{ groups: NotificationPreferences }>>(
    `${BASE_PATH}/preferences`,
    { groups },
  );
  return response.data.data.groups;
}
