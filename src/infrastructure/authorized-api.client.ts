import axios, { InternalAxiosRequestConfig } from 'axios';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

const authorizedApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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
      if (typeof window !== 'undefined') {
        window.location.replace(AppRoutePaths.LOGIN);
      }
    }
    return Promise.reject(error);
  },
);

export default authorizedApiClient;
