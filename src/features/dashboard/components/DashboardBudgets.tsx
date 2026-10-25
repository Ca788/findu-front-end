'use client';

import Link from 'next/link';
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
import { DashboardCard } from '@/features/dashboard/components/DashboardCard';
import { EmptyState } from '@/components/common/EmptyState';
import { riseDelay } from '@/features/dashboard/components/CycleTransition';

interface DashboardBudgetsProps {
  referenceDate: string;
}

function progressColor(usage: number): 'success' | 'warning' | 'error' {
  if (usage >= 100) return 'error';
  if (usage >= 80) return 'warning';
  return 'success';
}

function BudgetRow({ budget, index }: { budget: Budget; index: number }) {
  const usage = Math.min(200, Number(budget.usage_percent ?? 0));
  const color = progressColor(usage);
  const periodLabel = BUDGET_PERIOD_LABELS[budget.period_type];

  return (
    <Stack spacing={1} className="min-w-0 findu-anim-rise" style={riseDelay(index)}>
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
        sx={{
          height: 8,
          borderRadius: 999,
          '& .MuiLinearProgress-bar': { transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)' },
        }}
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
    <DashboardCard
      className="findu-anim-rise"
      title="Metas"
      action={
        <Button
          component={Link}
          href={AppRoutePaths.BUDGETS}
          size="small"
          variant="text"
        >
          Ver todas
        </Button>
      }
    >
      {isError && (
        <Typography variant="body2" color="error.main">
          Erro ao carregar orçamentos.
        </Typography>
      )}

      {isLoading && (
        <LinearProgress variant="indeterminate" sx={{ borderRadius: 999, height: 3 }} />
      )}

      {!isLoading && !isError && budgets.length === 0 && (
        <EmptyState
          illustration="shield"
          title="Nenhuma meta ativa"
          description="Defina um limite por período e acompanhe o consumo aqui."
          actionLabel="Criar meta"
          actionHref={AppRoutePaths.BUDGETS}
        />
      )}

      {budgets.length > 0 && (
        <Stack spacing={2.5}>
          {budgets.slice(0, 3).map((budget, index) => (
            <BudgetRow key={budget.id} budget={budget} index={index} />
          ))}
        </Stack>
      )}
    </DashboardCard>
  );
}
