'use client';

import Typography from '@mui/material/Typography';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

export function ChatGreeting() {
  const { user } = useCurrentUser();
  const firstName = (user?.name ?? '').trim().split(/\s+/)[0] || '';

  return (
    <div className="findu-anim-fade-in flex flex-col items-center gap-2 text-center">
      <Typography
        variant="h3"
        component="h2"
        sx={(theme) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
        })}
      >
        Olá{firstName ? `, ${firstName}` : ''}! No que você está pensando?
      </Typography>
    </div>
  );
}
