'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthFormShell } from '@/features/auth/components/AuthFormShell';
import { ResetPasswordForm } from '@/features/auth/components/resetPassword/ResetPasswordForm';

function ResetPasswordRoute() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  return (
    <AuthFormShell
      title="Definir nova senha"
      description="Escolha uma nova senha para sua conta."
    >
      <ResetPasswordForm token={token} />
    </AuthFormShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#0B1220',
          }}
        >
          <CircularProgress sx={{ color: '#fff' }} />
        </Box>
      }
    >
      <ResetPasswordRoute />
    </Suspense>
  );
}
