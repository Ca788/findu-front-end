'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { formatBRL } from '@/utils/currency';
import type {
  Statement,
  StatementByCategory,
} from '@/features/statements/models/statement.model';
import type { InstallmentPlan } from '@/features/installments/models/installment.model';
import type { RecurrenceRule } from '@/features/recurrences/models/recurrence.model';

function CategoryBreakdown({ rows }: { rows: StatementByCategory[] }) {
  if (rows.length === 0) return null;
  return (
    <Paper className="flex flex-col gap-2 rounded-2xl p-4">
      <Typography variant="subtitle2">Por categoria</Typography>
      <Divider />
      {rows.map((row) => (
        <div key={row.category_id ?? 'uncategorized'} className="flex items-center justify-between">
          <Typography variant="body2">{row.category_name || 'Sem categoria'}</Typography>
          <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatBRL(row.paid)} / {formatBRL(row.forecast)}
          </Typography>
        </div>
      ))}
    </Paper>
  );
}

function InstallmentsList({ plans }: { plans: InstallmentPlan[] }) {
  if (plans.length === 0) return null;
  return (
    <Paper className="flex flex-col gap-2 rounded-2xl p-4">
      <Typography variant="subtitle2">Parcelamentos ativos</Typography>
      <Divider />
      {plans.map((plan) => (
        <div key={plan.id} className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <Typography variant="body2" className="truncate">
              {plan.description || 'Parcelamento'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {plan.paid_count}/{plan.total_installments} pagas · resta {formatBRL(plan.remaining_amount)}
            </Typography>
          </div>
          <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatBRL(plan.monthly_amount)}
          </Typography>
        </div>
      ))}
    </Paper>
  );
}

function RecurrencesList({ rules }: { rules: RecurrenceRule[] }) {
  if (rules.length === 0) return null;
  return (
    <Paper className="flex flex-col gap-2 rounded-2xl p-4">
      <Typography variant="subtitle2">Recorrências ativas</Typography>
      <Divider />
      {rules.map((rule) => (
        <div key={rule.id} className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <Typography variant="body2" className="truncate">
              {rule.description || 'Recorrência'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {rule.transaction_type === 'income' ? 'Receita' : 'Despesa'}
              {rule.day_of_month ? ` · dia ${rule.day_of_month}` : ''}
            </Typography>
          </div>
          <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatBRL(rule.amount)}
          </Typography>
        </div>
      ))}
    </Paper>
  );
}

export function StatementSideLists({ statement }: { statement?: Statement }) {
  if (!statement) return null;

  return (
    <div className="flex flex-col gap-3">
      <InstallmentsList plans={statement.installments_active} />
      <RecurrencesList rules={statement.recurrences_active} />
      <CategoryBreakdown rows={statement.by_category} />
    </div>
  );
}
