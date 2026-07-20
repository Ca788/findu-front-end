'use client';

import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useCurrentBudgets } from '@/features/budgets/hooks/useCurrentBudgets';
import { BUDGET_PERIOD_LABELS } from '@/features/budgets/models/budget.model';
import type { Budget } from '@/features/budgets/models/budget.model';
import { formatBRL } from '@/utils/currency';
import { formatDateBR } from '@/utils/date';

interface DashboardBudgetsProps {
  referenceDate: string;
}

function progressColor(usage: number): 'success' | 'warning' | 'error' {
  if (usage >= 100) return 'error';
  if (usage >= 80) return 'warning';
  return 'success';
}

function BudgetRow({ budget }: { budget: Budget }) {
  const usage = Math.min(200, Number(budget.usage_percent ?? 0));
  const color = progressColor(usage);
  const periodLabel = BUDGET_PERIOD_LABELS[budget.period_type];

  return (
    <Stack spacing={0.75} className="min-w-0">
      <div className="flex min-w-0 items-baseline justify-between gap-2">
        <Typography variant="body2" className="truncate font-medium" sx={{ fontWeight: 600 }}>
          {periodLabel}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontVariantNumeric: 'tabular-nums',
            flexShrink: 0,
            textAlign: 'right',
            maxWidth: '55%',
          }}
        >
          {formatBRL(budget.spent_amount ?? 0)} / {formatBRL(budget.limit_amount)}
        </Typography>
      </div>
      <LinearProgress
        variant="determinate"
        color={color}
        value={Math.min(100, usage)}
        sx={{ height: 7, borderRadius: 999 }}
      />
      <div className="flex min-w-0 items-center justify-between gap-2">
        <Typography variant="caption" color="text.secondary" className="truncate">
          {formatDateBR(budget.period_start)} — {formatDateBR(budget.period_end)}
        </Typography>
        <Typography
          variant="caption"
          color={color === 'success' ? 'text.secondary' : `${color}.main`}
          sx={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0, fontWeight: 600 }}
        >
          {usage.toFixed(0)}%
        </Typography>
      </div>
    </Stack>
  );
}

export function DashboardBudgets({ referenceDate }: DashboardBudgetsProps) {
  const { data, isLoading, isError } = useCurrentBudgets(referenceDate);
  const budgets = data ?? [];

  return (
    <Paper className="flex min-w-0 flex-col gap-4 rounded-2xl px-4 py-4 md:px-5 md:py-5">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} className="truncate">
          Orçamentos
        </Typography>
        <Button
          component={Link}
          href={AppRoutePaths.BUDGETS}
          size="small"
          variant="text"
          sx={{ flexShrink: 0 }}
        >
          Ver todos
        </Button>
      </div>

      {isError && (
        <Typography variant="body2" color="error.main">
          Erro ao carregar orçamentos.
        </Typography>
      )}

      {isLoading && (
        <LinearProgress variant="indeterminate" sx={{ borderRadius: 999, height: 3 }} />
      )}

      {!isLoading && !isError && budgets.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhum orçamento vigente para hoje.
        </Typography>
      )}

      {budgets.length > 0 && (
        <Stack spacing={2.5}>
          {budgets.slice(0, 4).map((budget) => (
            <BudgetRow key={budget.id} budget={budget} />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
