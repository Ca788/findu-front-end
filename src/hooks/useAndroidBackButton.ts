'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export function useAndroidBackButton() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handle: { remove: () => Promise<void> } | undefined;

    void App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
        return;
      }
      void App.exitApp();
    }).then((listener) => {
      handle = listener;
    });

    return () => {
      void handle?.remove();
    };
  }, []);
}
