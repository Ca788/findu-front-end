'use client';

import type { Budget } from '@/features/budgets/models/budget.model';
import { BudgetCardItem } from '@/features/budgets/components/list/BudgetCardItem';
import { EmptyState } from '@/components/common/EmptyState';

interface BudgetsCardListProps {
  budgets: Budget[];
  isLoading: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export function BudgetsCardList({ budgets, isLoading, onEdit, onDelete }: BudgetsCardListProps) {
  if (!isLoading && budgets.length === 0) {
    return (
      <EmptyState
        variant="card"
        illustration="shield"
        title="Nenhum orçamento ainda"
        description="Defina um limite por período e acompanhe o consumo em tempo real."
      />
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
