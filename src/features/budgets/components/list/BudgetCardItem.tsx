'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { formatDateBR } from '@/utils/date';
import { RowActions } from '@/components/common/RowActions';
import {
  BUDGET_PERIOD_LABELS,
  type Budget,
} from '@/features/budgets/models/budget.model';
import { BudgetProgress } from '@/features/budgets/components/list/BudgetProgress';

interface BudgetCardItemProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export function BudgetCardItem({ budget, onEdit, onDelete }: BudgetCardItemProps) {
  return (
    <Paper className="flex flex-col gap-3 rounded-2xl px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Typography variant="body1" className="font-medium">
            {BUDGET_PERIOD_LABELS[budget.period_type]}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDateBR(budget.period_start)} – {formatDateBR(budget.period_end)}
          </Typography>
        </div>
        <RowActions
          onEdit={() => onEdit(budget)}
          onDelete={() => onDelete(budget)}
        />
      </div>
      <BudgetProgress
        limit={budget.limit_amount}
        spent={budget.spent_amount}
        usagePercent={budget.usage_percent}
      />
    </Paper>
  );
}
