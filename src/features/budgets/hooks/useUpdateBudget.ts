import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBudget } from '@/features/budgets/gateway/budgets.gateway';
import { BUDGETS_LIST_KEY } from '@/features/budgets/hooks/useBudgets';
import type { BudgetInput } from '@/features/budgets/models/budget.model';

interface UpdateArgs {
  id: string;
  input: BudgetInput;
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: UpdateArgs) => updateBudget(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_LIST_KEY] });
    },
  });
}
