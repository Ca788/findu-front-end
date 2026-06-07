'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

interface DashboardWelcomeProps {
  monthLabel: string;
}

function capitalizeFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function DashboardWelcome({ monthLabel }: DashboardWelcomeProps) {
  const { user } = useCurrentUser();
  const firstName = (user?.name ?? '').split(' ')[0] || 'por aí';

  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="text.secondary">
        Dashboard
      </Typography>
      <Typography variant="h5" component="h1" className="font-semibold">
        Olá, {firstName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Resumo de {capitalizeFirst(monthLabel)}.
      </Typography>
    </Stack>
  );
}
