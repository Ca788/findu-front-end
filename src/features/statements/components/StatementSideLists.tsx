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
    <Paper className="flex min-w-0 flex-col gap-2 rounded-2xl p-4">
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Por categoria
      </Typography>

      <Divider />
      {rows.map((row) => (
        <div
          key={row.category_id ?? 'uncategorized'}
          className="flex min-w-0 items-center justify-between gap-3"
        >
          <Typography variant="body2" className="min-w-0 truncate">
            {row.category_name || 'Sem categoria'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontVariantNumeric: 'tabular-nums',
              flexShrink: 0,
              textAlign: 'right',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
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
    <Paper className="flex min-w-0 flex-col gap-2 rounded-2xl p-4">
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Parcelamentos ativos
      </Typography>
      <Divider />
      {plans.map((plan) => (
        <div key={plan.id} className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <Typography variant="body2" className="truncate" sx={{ fontWeight: 500 }}>
              {plan.description || 'Parcelamento'}
            </Typography>
            <Typography variant="caption" color="text.secondary" className="truncate block">
              {plan.paid_count}/{plan.total_installments} pagas · resta{' '}
              {formatBRL(plan.remaining_amount)}
            </Typography>
          </div>
          <Typography
            variant="body2"
            sx={{
              fontVariantNumeric: 'tabular-nums',
              flexShrink: 0,
              fontWeight: 700,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
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
    <Paper className="flex min-w-0 flex-col gap-2 rounded-2xl p-4">
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Recorrências ativas
      </Typography>
      <Divider />
      {rules.map((rule) => (
        <div key={rule.id} className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <Typography variant="body2" className="truncate" sx={{ fontWeight: 500 }}>
              {rule.description || 'Recorrência'}
            </Typography>
            <Typography variant="caption" color="text.secondary" className="truncate block">
              {rule.transaction_type === 'income' ? 'Receita' : 'Despesa'}
              {rule.day_of_month ? ` · dia ${rule.day_of_month}` : ''}
            </Typography>
          </div>
          <Typography
            variant="body2"
            sx={{
              fontVariantNumeric: 'tabular-nums',
              flexShrink: 0,
              fontWeight: 700,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
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
    <div className="flex min-w-0 flex-col gap-3">
      <InstallmentsList plans={statement.installments_active} />
      <RecurrencesList rules={statement.recurrences_active} />
      <CategoryBreakdown rows={statement.by_category} />
    </div>
  );
}
