import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants/apiBaseUrl';
import {
  CLIENT_PLATFORM_HEADER,
  getAccessToken,
  getClientPlatform,
  notifyUnauthorized,
  refreshSession,
} from '@/infrastructure/session';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthHandler?: boolean;
    _retriedAfterRefresh?: boolean;
  }
}

const authorizedApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

authorizedApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers[CLIENT_PLATFORM_HEADER] = getClientPlatform();
    return config;
  },
  (error) => Promise.reject(error),
);

authorizedApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;
    const status = error.response?.status;

    if (status !== 401 || !config || config.skipAuthHandler) {
      return Promise.reject(error);
    }

    if (!config._retriedAfterRefresh) {
      const newToken = await refreshSession();
      if (newToken) {
        config._retriedAfterRefresh = true;
        config.headers.Authorization = `Bearer ${newToken}`;
        return authorizedApiClient.request(config);
      }
    }

    notifyUnauthorized();
    return Promise.reject(error);
  },
);

export default authorizedApiClient;
