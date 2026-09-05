'use client';

import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { formatBRL } from '@/utils/currency';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
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
    <Paper className="flex min-w-0 flex-col gap-3 rounded-xl px-4 py-4">
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        Por categoria
      </Typography>
      {visible.map((row) => {
        const forecast = Number(row.forecast) || 0;
        const paid = Number(row.paid) || 0;
        const pct = forecast > 0 ? Math.min(100, Math.round((paid / forecast) * 100)) : 0;

        return (
          <Box key={row.category_id ?? 'uncategorized'} className="min-w-0">
            <div className="mb-1 flex items-baseline justify-between gap-2">
              {row.category_id ? (
                <Typography
                  component={Link}
                  href={AppRoutePaths.categoryDetail(row.category_id, month)}
                  variant="body2"
                  sx={{ fontWeight: 600, color: 'inherit' }}
                  className="min-w-0 truncate no-underline"
                >
                  {row.category_name || 'Sem categoria'}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 600 }} className="min-w-0 truncate">
                  {row.category_name || 'Sem categoria'}
                </Typography>
              )}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}
              >
                {formatBRL(paid)}
              </Typography>
            </div>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{ height: 6, borderRadius: 999 }}
            />
          </Box>
        );
      })}
      {compact && rows.length > visible.length && (
        <Typography variant="caption" color="text.secondary">
          +{rows.length - visible.length} categorias
        </Typography>
      )}
    </Paper>
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
  const visible = compact ? plans.slice(0, 2) : plans;

  return (
    <Paper className="flex min-w-0 flex-col gap-2.5 rounded-xl px-4 py-4">
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        Parcelas
      </Typography>
      {visible.map((plan) => (
        <div key={plan.id} className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <Typography variant="body2" className="truncate" sx={{ fontWeight: 600 }}>
              {plan.description || 'Parcelamento'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {plan.paid_count}/{plan.total_installments} pagas
            </Typography>
          </div>
          <Typography
            variant="body2"
            sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, flexShrink: 0 }}
          >
            {formatBRL(plan.monthly_amount)}
          </Typography>
        </div>
      ))}
    </Paper>
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
    <Paper className="flex min-w-0 flex-col gap-2.5 rounded-xl px-4 py-4">
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        Recorrentes
      </Typography>
      {visible.map((rule) => (
        <div key={rule.id} className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <Typography variant="body2" className="truncate" sx={{ fontWeight: 600 }}>
              {rule.description || 'Recorrência'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {rule.transaction_type === 'income' ? 'Receita' : 'Despesa'}
              {rule.day_of_month ? ` · dia ${rule.day_of_month}` : ''}
            </Typography>
          </div>
          <Typography
            variant="body2"
            sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, flexShrink: 0 }}
          >
            {formatBRL(rule.amount)}
          </Typography>
        </div>
      ))}
    </Paper>
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
