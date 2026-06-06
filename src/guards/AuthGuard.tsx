'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(AppRoutePaths.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <Box className="flex flex-1 items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
