'use client';

import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useCurrentBudgets } from '@/features/budgets/hooks/useCurrentBudgets';
import { useBudgets } from '@/features/budgets/hooks/useBudgets';
import { BUDGET_PERIOD_LABELS } from '@/features/budgets/models/budget.model';
import type { Budget } from '@/features/budgets/models/budget.model';
import { useGoals } from '@/features/goals/hooks/useGoals';
import type { Goal } from '@/features/goals/models/goal.model';
import { formatBRL } from '@/utils/currency';
import { DashboardCard } from '@/features/dashboard/components/DashboardCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ProgressItemRow, type ProgressTone } from '@/components/common/ProgressItemRow';
import { riseDelay } from '@/features/dashboard/components/CycleTransition';

interface DashboardBudgetsProps {
  referenceDate: string;
}

function budgetTone(usage: number): ProgressTone {
  if (usage >= 100) return 'bad';
  if (usage >= 80) return 'warn';
  return 'good';
}

function budgetBadge(usage: number): string | undefined {
  if (usage >= 100) return 'Estourou';
  if (usage >= 80) return 'Atenção';
  if (usage <= 40) return 'Sobra folga';
  return 'No ritmo';
}

function goalTone(progress: number, status: Goal['status']): ProgressTone {
  if (status === 'achieved' || progress >= 100) return 'good';
  if (progress >= 70) return 'neutral';
  return 'warn';
}

function goalBadge(goal: Goal): string | undefined {
  if (goal.status === 'achieved' || goal.progress_percent >= 100) return 'Concluída';
  if (goal.progress_percent >= 70) return 'Quase lá';
  return undefined;
}

function goalSubtitle(goal: Goal): string {
  if (goal.status === 'achieved' || goal.progress_percent >= 100) {
    return 'Meta atingida';
  }
  return `Falta ${formatBRL(goal.remaining_amount)}`;
}

function GoalRow({ goal, index }: { goal: Goal; index: number }) {
  return (
    <div className="findu-anim-rise min-w-0" style={riseDelay(index)}>
      <ProgressItemRow
        title={goal.name}
        subtitle={goalSubtitle(goal)}
        value={formatBRL(goal.current_amount)}
        progress={goal.progress_percent}
        tone={goalTone(goal.progress_percent, goal.status)}
        badge={goalBadge(goal)}
      />
    </div>
  );
}

function BudgetRow({ budget, index }: { budget: Budget; index: number }) {
  const usage = Number(budget.usage_percent ?? 0);

  return (
    <div className="findu-anim-rise min-w-0" style={riseDelay(index)}>
      <ProgressItemRow
        title={BUDGET_PERIOD_LABELS[budget.period_type]}
        subtitle={`${formatBRL(budget.spent_amount ?? 0)} de ${formatBRL(budget.limit_amount)}`}
        value={`${Math.min(999, Math.round(usage))}%`}
        progress={Math.min(100, usage)}
        tone={budgetTone(usage)}
        badge={budgetBadge(usage)}
        href={AppRoutePaths.BUDGETS}
      />
    </div>
  );
}

export function DashboardBudgets({ referenceDate }: DashboardBudgetsProps) {
  const goalsQuery = useGoals({ page: 1, perPage: 6, status: 'active' });
  const currentQuery = useCurrentBudgets(referenceDate);
  const listQuery = useBudgets({ page: 1, perPage: 6 });

  const goals = goalsQuery.data?.data ?? [];
  const current = currentQuery.data ?? [];
  const listed = listQuery.data?.data ?? [];
  const budgets = current.length > 0 ? current : listed;
  const showGoals = goals.length > 0;
  const items = showGoals ? goals : budgets;
  const loading =
    goalsQuery.isLoading ||
    (goals.length === 0 && currentQuery.isLoading) ||
    (goals.length === 0 && current.length === 0 && listQuery.isLoading);
  const failed = goalsQuery.isError && currentQuery.isError && listQuery.isError;

  return (
    <DashboardCard
      className="findu-anim-rise"
      title="Metas"
      subtitle={
        items.length > 0
          ? showGoals
            ? `${goals.length} ${goals.length === 1 ? 'objetivo' : 'objetivos'} em andamento`
            : `${budgets.length} ${budgets.length === 1 ? 'orçamento' : 'orçamentos'} no período`
          : undefined
      }
      action={
        <Button
          component={Link}
          href={showGoals ? AppRoutePaths.CHAT : AppRoutePaths.BUDGETS}
          size="small"
          variant="text"
        >
          {showGoals ? 'No chat' : 'Ver todas'}
        </Button>
      }
    >
      {failed && (
        <Typography variant="body2" color="error.main">
          Erro ao carregar metas.
        </Typography>
      )}

      {loading && (
        <LinearProgress variant="indeterminate" sx={{ borderRadius: 999, height: 3 }} />
      )}

      {!loading && !failed && items.length === 0 && (
        <EmptyState
          variant="compact"
          illustration="rocket"
          title="Nenhuma meta ativa"
          description="Peça no chat ou defina um limite de gastos."
          actionLabel="Criar meta"
          actionHref={AppRoutePaths.CHAT}
        />
      )}

      {items.length > 0 && (
        <Stack spacing={1.75}>
          {showGoals
            ? goals.slice(0, 3).map((goal, index) => (
                <GoalRow key={goal.id} goal={goal} index={index} />
              ))
            : budgets.slice(0, 3).map((budget, index) => (
                <BudgetRow key={budget.id} budget={budget} index={index} />
              ))}
        </Stack>
      )}
    </DashboardCard>
  );
}
