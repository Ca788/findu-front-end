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
    <Stack spacing={0.5}>
      <div className="flex items-baseline justify-between gap-2">
        <Typography variant="body2" className="font-medium">
          {periodLabel}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {formatBRL(budget.spent_amount ?? 0)} / {formatBRL(budget.limit_amount)}
        </Typography>
      </div>
      <LinearProgress
        variant="determinate"
        color={color}
        value={Math.min(100, usage)}
        sx={{ height: 8, borderRadius: 999 }}
      />
      <div className="flex items-center justify-between">
        <Typography variant="caption" color="text.secondary">
          {formatDateBR(budget.period_start)} — {formatDateBR(budget.period_end)}
        </Typography>
        <Typography
          variant="caption"
          color={color === 'success' ? 'text.secondary' : `${color}.main`}
          sx={{ fontVariantNumeric: 'tabular-nums' }}
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
    <Paper className="flex flex-col gap-4 rounded-2xl px-4 py-4 md:px-6 md:py-5">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="subtitle1" className="font-semibold">
          Orçamentos vigentes
        </Typography>
        <Button
          component={Link}
          href={AppRoutePaths.BUDGETS}
          size="small"
          variant="text"
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
        <LinearProgress variant="indeterminate" sx={{ borderRadius: 999 }} />
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
