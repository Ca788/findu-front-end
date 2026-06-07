'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthState,
  updateProfile as updateProfileThunk,
} from '@/store/slices/auth.slice';
import type { AppDispatch } from '@/store';
import type { UpdateProfileInput } from '@/features/auth/models/auth.model';

export function useUpdateProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(selectAuthState);

  const update = (input: UpdateProfileInput) =>
    dispatch(updateProfileThunk(input));

  return {
    update,
    isLoading: loading,
    error,
  };
}
