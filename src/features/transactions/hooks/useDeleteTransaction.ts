import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction } from '@/features/transactions/gateway/transactions.gateway';
import { TRANSACTIONS_LIST_KEY } from '@/features/transactions/hooks/useTransactions';

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_LIST_KEY] });
    },
  });
}
