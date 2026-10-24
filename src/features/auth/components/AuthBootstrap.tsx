'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserFromToken,
  selectAuthState,
  sessionExpired,
} from '@/store/slices/auth.slice';
import { setUnauthorizedHandler } from '@/infrastructure/session';
import type { AppDispatch } from '@/store';

export function AuthBootstrap() {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector(selectAuthState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getUserFromToken());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setUnauthorizedHandler(() => dispatch(sessionExpired()));
    return () => setUnauthorizedHandler(null);
  }, [dispatch]);

  return null;
}
