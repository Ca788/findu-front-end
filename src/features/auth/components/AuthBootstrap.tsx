'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserFromToken,
  selectAuthState,
} from '@/store/slices/auth.slice';
import type { AppDispatch } from '@/store';

export function AuthBootstrap() {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector(selectAuthState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getUserFromToken());
    }
  }, [dispatch, status]);

  return null;
}
