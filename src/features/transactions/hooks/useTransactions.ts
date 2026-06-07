import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  listTransactions,
  type ListTransactionsParams,
} from '@/features/transactions/gateway/transactions.gateway';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { Transaction } from '@/features/transactions/models/transaction.model';

export const TRANSACTIONS_LIST_KEY = 'transactions:list';

export function useTransactions(params: ListTransactionsParams) {
  return useAppQuery<PaginatedSuccessResponse<Transaction>>({
    queryKey: [TRANSACTIONS_LIST_KEY, params],
    queryFn: () => listTransactions(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}
