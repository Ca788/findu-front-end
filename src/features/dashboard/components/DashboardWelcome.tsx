'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRightRounded';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import type { DashboardMonth } from '@/features/dashboard/hooks/useDashboardMonth';

interface DashboardWelcomeProps {
  cycle: DashboardMonth;
}

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function DashboardWelcome({ cycle }: DashboardWelcomeProps) {
  const { monthParam, monthLabel, direction, isCurrentMonth, onPreviousMonth, onNextMonth, onCurrentMonth } =
    cycle;
  const { user } = useCurrentUser();
  const firstName = (user?.name ?? '').split(' ')[0] || 'por aí';
  const animation = direction === 'next' ? 'findu-anim-cycle-next' : 'findu-anim-cycle-prev';

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
        <Box sx={{ overflow: 'hidden', minWidth: 0 }}>
          <Typography
            key={monthParam}
            component="h1"
            className={animation}
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.035em',
              fontSize: { xs: '1.45rem', md: '1.75rem' },
              lineHeight: 1.15,
              color: 'text.primary',
              minWidth: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {monthLabel}
          </Typography>
        </Box>
        <IconButton aria-label="Próximo mês" onClick={onNextMonth} size="small">
          <ChevronRightIcon />
        </IconButton>
        {!isCurrentMonth && (
          <Chip
            label="Hoje"
            size="small"
            color="primary"
            variant="outlined"
            onClick={onCurrentMonth}
            className="findu-anim-fade-in-soft"
            sx={{ ml: 0.5 }}
          />
        )}
      </Box>
    </Box>
  );
}
