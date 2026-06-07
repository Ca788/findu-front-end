import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTransaction } from '@/features/transactions/gateway/transactions.gateway';
import { TRANSACTIONS_LIST_KEY } from '@/features/transactions/hooks/useTransactions';
import type { TransactionInput } from '@/features/transactions/models/transaction.model';

interface UpdateArgs {
  id: string;
  input: TransactionInput;
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: UpdateArgs) => updateTransaction(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_LIST_KEY] });
    },
  });
}
