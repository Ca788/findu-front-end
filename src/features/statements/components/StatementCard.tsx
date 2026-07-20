'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import ChevronRightIcon from '@mui/icons-material/ChevronRightRounded';
import { formatBRL } from '@/utils/currency';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { currentMonthParam, formatMonthLabel } from '@/features/statements/utils/month';
import type { StatementSummary } from '@/features/statements/models/statement.model';

interface StatementCardProps {
  summary: StatementSummary;
}

export function StatementCard({ summary }: StatementCardProps) {
  const balanceForecast = Number(summary.balance_forecast);
  const balanceActual = Number(summary.balance_actual);
  const total = summary.pending_count + summary.paid_count;
  const percent = total > 0 ? Math.round((summary.paid_count / total) * 100) : 0;
  const isCurrent = summary.month === currentMonthParam();
  const positive = balanceForecast >= 0;

  return (
    <Paper
      component={Link}
      href={AppRoutePaths.statementDetail(summary.month)}
      className="group flex min-w-0 cursor-pointer flex-col gap-3 rounded-2xl p-4 no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
      sx={{ color: 'inherit' }}
    >
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <Typography
            variant="subtitle1"
            className="capitalize truncate"
            sx={{ fontWeight: 600, lineHeight: 1.3 }}
          >
            {formatMonthLabel(summary.month)}
          </Typography>
          {isCurrent && (
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label="Este mês"
              sx={{ mt: 0.75, height: 22, fontSize: 11 }}
            />
          )}
        </div>
        <ChevronRightIcon
          fontSize="small"
          sx={{ color: 'text.disabled', mt: 0.25, flexShrink: 0 }}
        />
      </div>

      <Box className="min-w-0">
        <Typography variant="caption" color="text.secondary">
          Saldo previsto
        </Typography>
        <Typography
          variant="h6"
          className="truncate"
          sx={{
            color: positive ? 'success.main' : 'error.main',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.15rem', sm: '1.25rem' },
            lineHeight: 1.25,
          }}
        >
          {formatBRL(balanceForecast)}
        </Typography>
        <Typography variant="caption" color="text.secondary" className="truncate block">
          Realizado {formatBRL(balanceActual)}
        </Typography>
      </Box>

      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0 flex-1">
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 6, borderRadius: 999 }}
          />
        </div>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            flexShrink: 0,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {summary.paid_count}/{total}
        </Typography>
      </div>
    </Paper>
  );
}
