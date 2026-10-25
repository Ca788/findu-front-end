'use client';

import Typography from '@mui/material/Typography';
import { formatBRL } from '@/utils/currency';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import {
  ProgressItemRow,
  ProgressListCard,
  type ProgressTone,
} from '@/components/common/ProgressItemRow';
import type {
  Statement,
  StatementByCategory,
} from '@/features/statements/models/statement.model';
import type { InstallmentPlan } from '@/features/installments/models/installment.model';
import type { RecurrenceRule } from '@/features/recurrences/models/recurrence.model';

interface StatementSideListsProps {
  statement?: Statement;
  compact?: boolean;
}

function installmentProgress(plan: InstallmentPlan): number {
  if (plan.total_installments <= 0) return 0;
  return Math.round((plan.paid_count / plan.total_installments) * 100);
}

function installmentTone(plan: InstallmentPlan): ProgressTone {
  if (plan.remaining_count <= 0) return 'good';
  if (plan.remaining_count <= 2) return 'warn';
  return 'neutral';
}

function installmentBadge(plan: InstallmentPlan): string | undefined {
  if (plan.remaining_count <= 0) return 'Quitado';
  if (plan.remaining_count === 1) return 'Última';
  if (plan.remaining_count === 2) return 'Quase lá';
  return undefined;
}

function installmentSubtitle(plan: InstallmentPlan): string {
  if (plan.remaining_count <= 0) return `${plan.total_installments} parcelas pagas`;
  if (plan.remaining_count === 1) return 'Falta 1 parcela';
  return `${plan.paid_count}/${plan.total_installments} · faltam ${plan.remaining_count}`;
}

function categoryProgress(row: StatementByCategory): number {
  const forecast = Number(row.forecast) || 0;
  const paid = Number(row.paid) || 0;
  if (forecast <= 0) return paid > 0 ? 100 : 0;
  return Math.min(100, Math.round((paid / forecast) * 100));
}

function categoryTone(progress: number, forecast: number): ProgressTone {
  if (forecast <= 0) return 'neutral';
  if (progress >= 100) return 'bad';
  if (progress >= 80) return 'warn';
  return 'good';
}

function categoryBadge(progress: number, forecast: number): string | undefined {
  if (forecast <= 0) return undefined;
  if (progress >= 100) return 'Estourou';
  if (progress >= 80) return 'Atenção';
  return 'No controle';
}

function CategoryBreakdown({
  rows,
  compact,
  month,
}: {
  rows: StatementByCategory[];
  compact?: boolean;
  month: string;
}) {
  if (rows.length === 0) return null;
  const visible = compact ? rows.slice(0, 4) : rows;

  return (
    <ProgressListCard title="Por categoria" href={AppRoutePaths.CATEGORIES}>
      {visible.map((row) => {
        const forecast = Number(row.forecast) || 0;
        const paid = Number(row.paid) || 0;
        const progress = categoryProgress(row);

        return (
          <ProgressItemRow
            key={row.category_id ?? 'uncategorized'}
            title={row.category_name || 'Sem categoria'}
            subtitle={forecast > 0 ? `de ${formatBRL(forecast)} previstos` : 'sem previsão'}
            value={formatBRL(paid)}
            progress={progress}
            tone={categoryTone(progress, forecast)}
            badge={categoryBadge(progress, forecast)}
            href={row.category_id ? AppRoutePaths.categoryDetail(row.category_id, month) : undefined}
          />
        );
      })}
      {compact && rows.length > visible.length ? (
        <Typography variant="caption" color="text.secondary">
          +{rows.length - visible.length} categorias
        </Typography>
      ) : null}
    </ProgressListCard>
  );
}

function InstallmentsList({
  plans,
  compact,
}: {
  plans: InstallmentPlan[];
  compact?: boolean;
}) {
  if (plans.length === 0) return null;
  const visible = compact ? plans.slice(0, 3) : plans;

  return (
    <ProgressListCard title="Parcelas" href={AppRoutePaths.INSTALLMENTS}>
      {visible.map((plan) => (
        <ProgressItemRow
          key={plan.id}
          title={plan.description || 'Parcelamento'}
          subtitle={installmentSubtitle(plan)}
          value={formatBRL(plan.monthly_amount)}
          progress={installmentProgress(plan)}
          tone={installmentTone(plan)}
          badge={installmentBadge(plan)}
          href={AppRoutePaths.INSTALLMENTS}
        />
      ))}
    </ProgressListCard>
  );
}

function RecurrencesList({
  rules,
  compact,
}: {
  rules: RecurrenceRule[];
  compact?: boolean;
}) {
  if (rules.length === 0) return null;
  const visible = compact ? rules.slice(0, 3) : rules;

  return (
    <ProgressListCard title="Recorrentes" href={AppRoutePaths.RECURRENCES}>
      {visible.map((rule) => {
        const income = rule.transaction_type === 'income';
        return (
          <ProgressItemRow
            key={rule.id}
            title={rule.description || 'Recorrência'}
            subtitle={income ? 'Receita todo mês' : 'Despesa todo mês'}
            value={formatBRL(rule.amount)}
            progress={rule.day_of_month ? Math.round((rule.day_of_month / 31) * 100) : 100}
            tone={income ? 'income' : 'neutral'}
            leading={rule.day_of_month ? 'day' : 'ring'}
            day={rule.day_of_month ?? undefined}
            href={AppRoutePaths.RECURRENCES}
          />
        );
      })}
    </ProgressListCard>
  );
}

export function StatementSideLists({
  statement,
  compact = false,
}: StatementSideListsProps) {
  if (!statement) return null;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <InstallmentsList plans={statement.installments_active} compact={compact} />
      <RecurrencesList rules={statement.recurrences_active} compact={compact} />
      <CategoryBreakdown
        rows={statement.by_category}
        compact={compact}
        month={statement.month}
      />
    </div>
  );
}
