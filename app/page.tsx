'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoginScreen } from '@/features/auth/components/login/LoginScreen';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(AppRoutePaths.CHAT);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer contentClassName="w-full max-w-md">
      <LoginScreen />
    </PageContainer>
  );
}
