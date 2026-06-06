'use client';

import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutThunk, selectAuthState } from '@/store/slices/auth.slice';
import type { AppDispatch } from '@/store';

export function useLogout() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(selectAuthState);

  const logout = () => dispatch(logoutThunk());

  return {
    logout,
    isLoading: loading,
    error,
  };
}
