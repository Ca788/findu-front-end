'use client';

import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { formatBRL } from '@/utils/currency';

interface BudgetProgressProps {
  limit: string;
  spent?: string;
  usagePercent?: number;
}

function pickColor(percent: number): 'success' | 'warning' | 'error' {
  if (percent >= 100) return 'error';
  if (percent >= 75) return 'warning';
  return 'success';
}

export function BudgetProgress({ limit, spent, usagePercent }: BudgetProgressProps) {
  const hasUsage = usagePercent !== undefined && spent !== undefined;
  const percent = hasUsage ? Math.min(usagePercent, 100) : 0;
  const color = hasUsage ? pickColor(usagePercent) : 'success';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <Typography variant="caption" color="text.secondary">
          {hasUsage ? `${formatBRL(spent)} de ${formatBRL(limit)}` : formatBRL(limit)}
        </Typography>
        {hasUsage && (
          <Typography variant="caption" color={`${color}.main`} className="font-medium">
            {Math.round(usagePercent)}%
          </Typography>
        )}
      </div>
      {hasUsage && (
        <LinearProgress
          variant="determinate"
          value={percent}
          color={color}
          sx={{ height: 6, borderRadius: 999 }}
        />
      )}
    </div>
  );
}
