'use client';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { formatDateBR } from '@/utils/date';
import { RowActions } from '@/components/common/RowActions';
import {
  BUDGET_PERIOD_LABELS,
  type Budget,
} from '@/features/budgets/models/budget.model';
import { BudgetProgress } from '@/features/budgets/components/list/BudgetProgress';

interface BudgetRowProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export function BudgetRow({ budget, onEdit, onDelete }: BudgetRowProps) {
  return (
    <TableRow hover>
      <TableCell>{BUDGET_PERIOD_LABELS[budget.period_type]}</TableCell>
      <TableCell>
        {formatDateBR(budget.period_start)} – {formatDateBR(budget.period_end)}
      </TableCell>
      <TableCell className="min-w-[220px]">
        <BudgetProgress
          limit={budget.limit_amount}
          spent={budget.spent_amount}
          usagePercent={budget.usage_percent}
        />
      </TableCell>
      <TableCell align="right" width={120}>
        <RowActions
          onEdit={() => onEdit(budget)}
          onDelete={() => onDelete(budget)}
        />
      </TableCell>
    </TableRow>
  );
}
