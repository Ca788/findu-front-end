import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEntry,
  deleteEntry,
  markEntryPaid,
  markEntryPending,
  updateEntry,
} from '@/features/statements/gateway/statements.gateway';
import { STATEMENT_KEY } from '@/features/statements/hooks/useStatement';
import { STATEMENTS_LIST_KEY } from '@/features/statements/hooks/useStatementsList';
import { CATEGORIES_LIST_KEY } from '@/features/categories/hooks/useCategories';
import { CATEGORY_TOTALS_KEY } from '@/features/categories/hooks/useCategoryTotals';
import { CATEGORY_TRANSACTIONS_KEY } from '@/features/categories/hooks/useCategoryTransactions';
import type { TransactionInput } from '@/features/transactions/models/transaction.model';

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: [STATEMENT_KEY] });
  queryClient.invalidateQueries({ queryKey: [STATEMENTS_LIST_KEY] });
  queryClient.invalidateQueries({ queryKey: [CATEGORIES_LIST_KEY] });
  queryClient.invalidateQueries({ queryKey: [CATEGORY_TOTALS_KEY] });
  queryClient.invalidateQueries({ queryKey: [CATEGORY_TRANSACTIONS_KEY] });
}

export function useCreateEntry(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TransactionInput) => createEntry(month, input),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useUpdateEntry(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; input: TransactionInput }) =>
      updateEntry(month, args.id, args.input),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useDeleteEntry(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEntry(month, id),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useMarkEntryPaid(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; paidAt?: string }) =>
      markEntryPaid(month, args.id, args.paidAt),
    onSuccess: () => invalidate(queryClient),
  });
}

export function useMarkEntryPending(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markEntryPending(month, id),
    onSuccess: () => invalidate(queryClient),
  });
}
