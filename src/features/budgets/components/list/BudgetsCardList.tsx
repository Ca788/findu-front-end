'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Budget } from '@/features/budgets/models/budget.model';
import { BudgetCardItem } from '@/features/budgets/components/list/BudgetCardItem';

interface BudgetsCardListProps {
  budgets: Budget[];
  isLoading: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export function BudgetsCardList({ budgets, isLoading, onEdit, onDelete }: BudgetsCardListProps) {
  if (!isLoading && budgets.length === 0) {
    return (
      <Paper className="rounded-2xl px-4 py-10 text-center">
        <Typography variant="body2" color="text.secondary">
          Nenhum orçamento cadastrado.
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {budgets.map((budget) => (
        <BudgetCardItem
          key={budget.id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
