import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  listBudgets,
  type ListBudgetsParams,
} from '@/features/budgets/gateway/budgets.gateway';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { Budget } from '@/features/budgets/models/budget.model';

export const BUDGETS_LIST_KEY = 'budgets:list';

export function useBudgets(params: ListBudgetsParams) {
  return useAppQuery<PaginatedSuccessResponse<Budget>>({
    queryKey: [BUDGETS_LIST_KEY, params],
    queryFn: () => listBudgets(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
