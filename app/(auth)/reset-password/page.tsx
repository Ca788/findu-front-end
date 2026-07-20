'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { ResetPasswordForm } from '@/features/auth/components/resetPassword/ResetPasswordForm';

function ResetPasswordRoute() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  return (
    <AuthCard
      eyebrow="FindU"
      title="Definir nova senha"
      description="Escolha uma nova senha para sua conta."
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Box className="flex justify-center py-12">
          <CircularProgress />
        </Box>
      }
    >
      <ResetPasswordRoute />
    </Suspense>
  );
}
