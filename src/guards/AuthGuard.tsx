'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname() ?? AppRoutePaths.DASHBOARD;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const next = encodeURIComponent(pathname);
      router.replace(`${AppRoutePaths.LOGIN}?next=${next}`);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <Box className="flex flex-1 items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
