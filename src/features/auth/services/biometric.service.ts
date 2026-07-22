'use client';

import { Capacitor } from '@capacitor/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';

const SERVER = 'com.findu.app';

export async function isBiometricAvailable(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const result = await NativeBiometric.isAvailable();
    return Boolean(result.isAvailable);
  } catch {
    return false;
  }
}

export function isBiometricEnabled(): boolean {
  return appStorage.get(AppStorageKeys.BIOMETRIC_ENABLED) === '1';
}

export async function enableBiometricLogin(email: string, password: string): Promise<void> {
  await NativeBiometric.setCredentials({
    username: email,
    password,
    server: SERVER,
  });
  appStorage.set(AppStorageKeys.BIOMETRIC_ENABLED, '1');
}

export async function disableBiometricLogin(): Promise<void> {
  try {
    await NativeBiometric.deleteCredentials({ server: SERVER });
  } catch {}
  appStorage.remove(AppStorageKeys.BIOMETRIC_ENABLED);
}

export async function loginWithBiometric(): Promise<{ email: string; password: string } | null> {
  if (!isBiometricEnabled()) return null;

  const available = await isBiometricAvailable();
  if (!available) return null;

  await NativeBiometric.verifyIdentity({
    reason: 'Desbloqueie o Findu',
    title: 'Findu',
    subtitle: 'Entre com a digital',
    description: 'Use a biometria do aparelho para continuar',
  });

  const credentials = await NativeBiometric.getCredentials({ server: SERVER });
  if (!credentials.username || !credentials.password) return null;

  return {
    email: credentials.username,
    password: credentials.password,
  };
}
