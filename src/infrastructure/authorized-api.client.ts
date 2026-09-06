import axios, { InternalAxiosRequestConfig } from 'axios';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { disconnectCable } from '@/infrastructure/cable.client';
import { API_BASE_URL } from '@/constants/apiBaseUrl';

const authorizedApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

authorizedApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = appStorage.get<string>(AppStorageKeys.TOKEN);
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

authorizedApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      appStorage.remove(AppStorageKeys.TOKEN);
      disconnectCable();
      if (typeof window !== 'undefined') {
        window.location.replace(AppRoutePaths.LOGIN);
      }
    }
    return Promise.reject(error);
  },
);

export default authorizedApiClient;
