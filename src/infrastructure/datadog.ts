'use client';

let initialized = false;

export function initDatadogRum() {
  if (initialized || typeof window === 'undefined') return;

  const applicationId = process.env.NEXT_PUBLIC_DD_APPLICATION_ID;
  const clientToken = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;
  const site = process.env.NEXT_PUBLIC_DD_SITE || 'datadoghq.com';
  const env = process.env.NEXT_PUBLIC_DD_ENV || process.env.NODE_ENV || 'development';

  if (!applicationId || !clientToken) return;

  initialized = true;

  void Promise.all([
    import('@datadog/browser-rum'),
    import('@datadog/browser-logs'),
  ]).then(([{ datadogRum }, { datadogLogs }]) => {
    datadogRum.init({
      applicationId,
      clientToken,
      site,
      service: 'findu-web',
      env,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    });

    datadogLogs.init({
      clientToken,
      site,
      service: 'findu-web',
      env,
      forwardErrorsToLogs: true,
      sessionSampleRate: 100,
    });

    datadogRum.startSessionReplayRecording();
  });
}
