'use client';

import { useEffect } from 'react';
import { useAndroidBackButton } from '@/hooks/useAndroidBackButton';
import { initDatadogRum } from '@/infrastructure/datadog';

export function NativeAppEffects() {
  useAndroidBackButton();

  useEffect(() => {
    initDatadogRum();
  }, []);

  return null;
}
