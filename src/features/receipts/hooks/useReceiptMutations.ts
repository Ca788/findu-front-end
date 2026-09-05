import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createReceipt,
  deliverReceipt,
  downloadReceipt,
} from '@/features/receipts/gateway/receipts.gateway';
import { RECEIPTS_LIST_KEY } from '@/features/receipts/hooks/useReceipts';
import type { ReceiptInput } from '@/features/receipts/models/receipt.model';

export function useCreateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReceiptInput) => createReceipt(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECEIPTS_LIST_KEY] });
    },
  });
}

export function useDeliverReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deliverReceipt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECEIPTS_LIST_KEY] });
    },
  });
}

export function useDownloadReceipt() {
  return useMutation({
    mutationFn: (args: { id: string; filename: string }) =>
      downloadReceipt(args.id, args.filename),
  });
}
