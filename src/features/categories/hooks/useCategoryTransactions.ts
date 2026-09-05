import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  listCategoryTransactions,
  type ListCategoryTransactionsParams,
} from '@/features/categories/gateway/categories.gateway';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { Transaction } from '@/features/transactions/models/transaction.model';

export const CATEGORY_TRANSACTIONS_KEY = 'categories:transactions';

export function useCategoryTransactions(
  params: ListCategoryTransactionsParams,
  enabled = true,
) {
  return useAppQuery<PaginatedSuccessResponse<Transaction>>({
    queryKey: [CATEGORY_TRANSACTIONS_KEY, params],
    queryFn: () => listCategoryTransactions(params),
    enabled: enabled && !!params.categoryId,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
