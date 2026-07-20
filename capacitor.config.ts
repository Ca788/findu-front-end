import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.findu.app',
  appName: 'findu',
  webDir: 'out',
  // Native HTTP bypasses WebView CORS (API currently omits Access-Control-Allow-*).
  // Long-term: allow https://localhost and capacitor://localhost on the Rails CORS config.
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
