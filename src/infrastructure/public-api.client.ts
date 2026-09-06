import axios from 'axios';
import { API_BASE_URL } from '@/constants/apiBaseUrl';

const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default publicApiClient;
