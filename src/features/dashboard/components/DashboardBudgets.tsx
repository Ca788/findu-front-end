'use client';

import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useCurrentBudgets } from '@/features/budgets/hooks/useCurrentBudgets';
import { BUDGET_PERIOD_LABELS } from '@/features/budgets/models/budget.model';
import type { Budget } from '@/features/budgets/models/budget.model';
import { formatBRL } from '@/utils/currency';

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
    <Stack spacing={1} className="min-w-0">
      <Box className="flex items-center justify-between gap-2">
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {periodLabel}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            color: color === 'success' ? 'text.secondary' : `${color}.main`,
          }}
        >
          {usage.toFixed(0)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        color={color}
        value={Math.min(100, usage)}
        sx={{ height: 8, borderRadius: 999 }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatBRL(budget.spent_amount ?? 0)} de {formatBRL(budget.limit_amount)}
      </Typography>
    </Stack>
  );
}

export function DashboardBudgets({ referenceDate }: DashboardBudgetsProps) {
  const { data, isLoading, isError } = useCurrentBudgets(referenceDate);
  const budgets = data ?? [];

  return (
    <Paper className="flex min-w-0 flex-col gap-3.5 rounded-xl px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Metas
        </Typography>
        <Button
          component={Link}
          href={AppRoutePaths.BUDGETS}
          size="small"
          variant="text"
        >
          Ver todas
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
          Nenhuma meta ativa agora.
        </Typography>
      )}

      {budgets.length > 0 && (
        <Stack spacing={2.5}>
          {budgets.slice(0, 3).map((budget) => (
            <BudgetRow key={budget.id} budget={budget} />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
