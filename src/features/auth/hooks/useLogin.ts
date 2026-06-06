'use client';

import { useDispatch, useSelector } from 'react-redux';
import { login as loginThunk, selectAuthState } from '@/store/slices/auth.slice';
import type { AppDispatch } from '@/store';
import type { LoginCredentials } from '@/features/auth/models/auth.model';

export function useLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, status } = useSelector(selectAuthState);

  const login = (credentials: LoginCredentials) =>
    dispatch(loginThunk(credentials));

  return {
    login,
    isLoading: loading,
    error,
    isAuthorized: status === 'authorized',
  };
}
