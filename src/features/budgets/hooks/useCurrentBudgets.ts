import { useAppQuery } from '@/hooks/useAppQuery';
import { getCurrentBudgets } from '@/features/budgets/gateway/budgets.gateway';
import type { Budget } from '@/features/budgets/models/budget.model';

export const BUDGETS_CURRENT_KEY = 'budgets:current';

export function useCurrentBudgets(referenceDate?: string) {
  return useAppQuery<Budget[]>({
    queryKey: [BUDGETS_CURRENT_KEY, referenceDate ?? 'today'],
    queryFn: () => getCurrentBudgets(referenceDate),
    staleTime: 60_000,
  });
}
