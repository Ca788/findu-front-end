import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  listReceipts,
  type ListReceiptsParams,
} from '@/features/receipts/gateway/receipts.gateway';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { Receipt } from '@/features/receipts/models/receipt.model';

export const RECEIPTS_LIST_KEY = 'receipts:list';

export function useReceipts(params: ListReceiptsParams) {
  return useAppQuery<PaginatedSuccessResponse<Receipt>>({
    queryKey: [RECEIPTS_LIST_KEY, params],
    queryFn: () => listReceipts(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
