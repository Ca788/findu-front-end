'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

interface DashboardWelcomeProps {
  monthLabel: string;
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
    <Stack spacing={0.35} className="findu-anim-fade-in">
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {greetingForNow()}, {firstName}
      </Typography>
      <Typography
        variant="h5"
        component="p"
        sx={{
          fontWeight: 700,
          letterSpacing: '-0.03em',
          fontSize: { xs: '1.45rem', sm: '1.6rem' },
          lineHeight: 1.15,
          color: 'text.primary',
        }}
      >
        {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
      </Typography>
    </Stack>
  );
}
