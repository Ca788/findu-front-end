'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  register as registerThunk,
  selectAuthState,
} from '@/store/slices/auth.slice';
import type { AppDispatch } from '@/store';
import type { RegisterCredentials } from '@/features/auth/models/auth.model';

export function useRegister() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, status } = useSelector(selectAuthState);

  const register = (credentials: RegisterCredentials) =>
    dispatch(registerThunk(credentials));

  return {
    register,
    isLoading: loading,
    error,
    isAuthorized: status === 'authorized',
  };
}
