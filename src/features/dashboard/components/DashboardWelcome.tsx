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

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function DashboardWelcome({ monthLabel }: DashboardWelcomeProps) {
  const { user } = useCurrentUser();
  const firstName = (user?.name ?? '').split(' ')[0] || 'por aí';

  return (
    <Stack spacing={0.25} className="findu-anim-fade-in">
      <Typography variant="body2" color="text.secondary">
        {greetingForNow()}, {firstName}
      </Typography>
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 700,
          letterSpacing: '-0.03em',
          fontSize: { xs: '1.65rem', sm: '1.75rem' },
          lineHeight: 1.15,
        }}
      >
        {capitalizeFirst(monthLabel)}
      </Typography>
    </Stack>
  );
}
