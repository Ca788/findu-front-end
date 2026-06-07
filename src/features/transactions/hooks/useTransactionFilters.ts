import { useCallback, useState } from 'react';
import type { TransactionListFilters } from '@/features/transactions/models/transaction.model';

const EMPTY: TransactionListFilters = {};

export function useTransactionFilters() {
  const [filters, setFilters] = useState<TransactionListFilters>(EMPTY);

  const update = useCallback(
    <K extends keyof TransactionListFilters>(
      key: K,
      value: TransactionListFilters[K] | undefined,
    ) => {
      setFilters((prev) => {
        const next = { ...prev };
        if (value === undefined || value === '') delete next[key];
        else next[key] = value;
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => setFilters(EMPTY), []);

  const hasFilters = Object.keys(filters).length > 0;

  return { filters, update, reset, hasFilters };
}
