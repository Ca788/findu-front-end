'use client';

import Box from '@mui/material/Box';
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
    <Box className="findu-anim-fade-in" sx={{ pt: 0.25 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500, mb: 0.35 }}
      >
        {greetingForNow()}, {firstName}
      </Typography>
      <Typography
        component="h1"
        sx={{
          fontWeight: 750,
          letterSpacing: '-0.035em',
          fontSize: { xs: '1.55rem', sm: '1.7rem' },
          lineHeight: 1.15,
          color: 'text.primary',
        }}
      >
        {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
      </Typography>
    </Box>
  );
}
