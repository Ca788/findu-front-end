import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/features/transactions/gateway/transactions.gateway';
import { TRANSACTIONS_LIST_KEY } from '@/features/transactions/hooks/useTransactions';
import type { TransactionInput } from '@/features/transactions/models/transaction.model';

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TransactionInput) => createTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_LIST_KEY] });
    },
  });
}
