'use client';

import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import { formatBRL } from '@/utils/currency';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { formatMonthLabel } from '@/features/statements/utils/month';
import type { StatementSummary } from '@/features/statements/models/statement.model';

interface StatementCardProps {
  summary: StatementSummary;
}

export function StatementCard({ summary }: StatementCardProps) {
  const balanceForecast = Number(summary.balance_forecast);
  const balanceActual = Number(summary.balance_actual);
  const total = summary.pending_count + summary.paid_count;
  const percent = total > 0 ? Math.round((summary.paid_count / total) * 100) : 0;
  const isCurrent = summary.month === new Date().toISOString().slice(0, 7);

  return (
    <Paper
      component={Link}
      href={`${AppRoutePaths.STATEMENTS}/${summary.month}`}
      className="flex cursor-pointer flex-col gap-3 rounded-2xl p-4 no-underline transition-shadow hover:shadow-md"
      sx={{ color: 'inherit' }}
    >
      <div className="flex items-center justify-between">
        <Typography variant="subtitle1" className="capitalize">
          {formatMonthLabel(summary.month)}
        </Typography>
        {isCurrent && <Chip size="small" color="primary" variant="outlined" label="Este mês" />}
      </div>

      <div className="flex flex-col gap-1">
        <Typography variant="caption" color="text.secondary">Saldo previsto</Typography>
        <Typography
          variant="h6"
          sx={{
            color: balanceForecast >= 0 ? 'success.main' : 'error.main',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 600,
          }}
        >
          {formatBRL(balanceForecast)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Realizado: {formatBRL(balanceActual)}
        </Typography>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <LinearProgress
            variant="determinate"
            value={percent}
            className="h-2 rounded"
          />
        </div>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: '4rem', textAlign: 'right' }}>
          {summary.paid_count}/{total} pagas
        </Typography>
      </div>
    </Paper>
  );
}
