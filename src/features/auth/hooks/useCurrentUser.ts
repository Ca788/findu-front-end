'use client';

import { useSelector } from 'react-redux';
import { selectAuthState } from '@/store/slices/auth.slice';

export function useCurrentUser() {
  const { user, status, loading } = useSelector(selectAuthState);

  return {
    user,
    isLoading: loading || status === 'idle',
    isAuthenticated: status === 'authorized',
    isUnauthenticated: status === 'unauthorized',
  };
}
