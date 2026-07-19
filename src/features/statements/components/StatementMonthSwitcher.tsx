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
    <div className="flex items-center gap-2">
      <IconButton onClick={() => onChange(addMonths(month, -1))} aria-label="Mês anterior">
        <ChevronLeftIcon />
      </IconButton>
      <Typography variant="h6" className="min-w-[10rem] text-center capitalize">
        {formatMonthLabel(month)}
      </Typography>
      <IconButton onClick={() => onChange(addMonths(month, 1))} aria-label="Próximo mês">
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
}
