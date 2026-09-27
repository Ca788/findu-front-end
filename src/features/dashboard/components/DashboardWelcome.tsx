'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRightRounded';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

interface DashboardWelcomeProps {
  monthLabel: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function DashboardWelcome({
  monthLabel,
  onPreviousMonth,
  onNextMonth,
}: DashboardWelcomeProps) {
  const { user } = useCurrentUser();
  const firstName = (user?.name ?? '').split(' ')[0] || 'por aí';

  return (
    <Box className="findu-anim-fade-in" sx={{ pt: 0.25, minWidth: 0 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 500, mb: 0.35 }}
      >
        {greetingForNow()}, {firstName}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0 }}>
        <IconButton
          aria-label="Mês anterior"
          onClick={onPreviousMonth}
          size="small"
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.035em',
            fontSize: { xs: '1.45rem', md: '1.75rem' },
            lineHeight: 1.15,
            color: 'text.primary',
            minWidth: 0,
          }}
        >
          {monthLabel}
        </Typography>
        <IconButton aria-label="Próximo mês" onClick={onNextMonth} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
