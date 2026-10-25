'use client';

import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { PushNotifications, type ActionPerformed } from '@capacitor/push-notifications';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';
import {
  registerDevice,
  unregisterDevice,
} from '@/features/notifications/gateway/notifications.gateway';

const CHANNEL_ID = 'findu_default';

export interface PushHandlers {
  onOpen: (data: Record<string, string>) => void;
  onReceived: () => void;
}

export function isPushSupported(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('PushNotifications');
}

export async function startPush(handlers: PushHandlers): Promise<() => void> {
  if (!isPushSupported()) return () => {};

  const listeners: PluginListenerHandle[] = [
    await PushNotifications.addListener('registration', async ({ value }) => {
      appStorage.set(AppStorageKeys.PUSH_TOKEN, value);
      await registerDevice(value, Capacitor.getPlatform());
    }),
    await PushNotifications.addListener('pushNotificationReceived', handlers.onReceived),
    await PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      handlers.onOpen((action.notification.data ?? {}) as Record<string, string>);
    }),
    await PushNotifications.addListener('registrationError', (error) => {
      console.warn('[push] registration failed', error);
    }),
  ];

  let permission = await PushNotifications.checkPermissions();
  if (permission.receive === 'prompt' || permission.receive === 'prompt-with-rationale') {
    permission = await PushNotifications.requestPermissions();
  }

  if (permission.receive === 'granted') {
    if (Capacitor.getPlatform() === 'android') {
      await PushNotifications.createChannel({
        id: CHANNEL_ID,
        name: 'Notificações',
        description: 'Contas a vencer, orçamentos, insights e lembretes do dia',
        importance: 4,
        visibility: 1,
        vibration: true,
      });
    }
    await PushNotifications.register();
  }

  return () => {
    listeners.forEach((listener) => void listener.remove());
  };
}

export async function stopPush(): Promise<void> {
  const token = appStorage.get<string>(AppStorageKeys.PUSH_TOKEN);
  if (!token) return;
  try {
    await unregisterDevice(token);
    appStorage.remove(AppStorageKeys.PUSH_TOKEN);
  } catch {
    return;
  }
}
