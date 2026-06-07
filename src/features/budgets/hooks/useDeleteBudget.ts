import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBudget } from '@/features/budgets/gateway/budgets.gateway';
import { BUDGETS_LIST_KEY } from '@/features/budgets/hooks/useBudgets';

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_LIST_KEY] });
    },
  });
}
