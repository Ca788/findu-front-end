'use client';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRightOutlined';
import { addMonths, formatMonthLabel } from '@/features/statements/utils/month';

interface StatementMonthSwitcherProps {
  month: string; // "YYYY-MM"
  onChange: (month: string) => void;
}

export function StatementMonthSwitcher({ month, onChange }: StatementMonthSwitcherProps) {
  return (
    <div className="flex w-full items-center justify-between gap-1 rounded-2xl border border-black/5 bg-black/[0.02] px-1 py-0.5 dark:border-white/10 dark:bg-white/5 sm:w-auto sm:justify-center sm:border-0 sm:bg-transparent sm:px-0 dark:sm:bg-transparent">
      <IconButton
        onClick={() => onChange(addMonths(month, -1))}
        aria-label="Mês anterior"
        size="large"
        sx={{ touchAction: 'manipulation' }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <Typography
        variant="subtitle1"
        className="min-w-0 flex-1 text-center capitalize sm:min-w-[11rem] sm:flex-none"
        sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.15rem' } }}
      >
        {formatMonthLabel(month)}
      </Typography>
      <IconButton
        onClick={() => onChange(addMonths(month, 1))}
        aria-label="Próximo mês"
        size="large"
        sx={{ touchAction: 'manipulation' }}
      >
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
}
