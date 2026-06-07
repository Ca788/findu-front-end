'use client';

import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { formatBRL } from '@/utils/currency';
import type { SummaryByCategory } from '@/features/summary/models/summary.model';

interface CategoryBreakdownItemProps {
  entry: SummaryByCategory;
  total: number;
}

export function CategoryBreakdownItem({ entry, total }: CategoryBreakdownItemProps) {
  const amount = Number(entry.amount);
  const percent = total > 0 ? Math.min(100, (amount / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3">
        <Typography variant="body2" className="min-w-0 truncate">
          {entry.category_name ?? 'Sem categoria'}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {formatBRL(amount)}
        </Typography>
      </div>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{ height: 6, borderRadius: 999 }}
      />
    </div>
  );
}
