import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBudget } from '@/features/budgets/gateway/budgets.gateway';
import { BUDGETS_LIST_KEY } from '@/features/budgets/hooks/useBudgets';
import type { BudgetInput } from '@/features/budgets/models/budget.model';

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BudgetInput) => createBudget(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_LIST_KEY] });
    },
  });
}
