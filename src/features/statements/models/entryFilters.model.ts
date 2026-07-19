import type {
  Transaction,
  TransactionSource,
  TransactionStatus,
  TransactionType,
} from '@/features/transactions/models/transaction.model';

export type EntryFilterStatus = TransactionStatus | 'all';
export type EntryFilterType = TransactionType | 'all';
export type EntryFilterSource = TransactionSource | 'all';

export interface StatementEntryFilters {
  status: EntryFilterStatus;
  transaction_type: EntryFilterType;
  source: EntryFilterSource;
  category_id: string; // '' = all
  search: string;
}

export const DEFAULT_ENTRY_FILTERS: StatementEntryFilters = {
  status: 'all',
  transaction_type: 'all',
  source: 'all',
  category_id: '',
  search: '',
};

export function hasActiveEntryFilters(filters: StatementEntryFilters): boolean {
  return (
    filters.status !== 'all' ||
    filters.transaction_type !== 'all' ||
    filters.source !== 'all' ||
    filters.category_id !== '' ||
    filters.search.trim() !== ''
  );
}

export function filterStatementEntries(
  entries: Transaction[],
  filters: StatementEntryFilters,
): Transaction[] {
  const search = filters.search.trim().toLowerCase();

  return entries.filter((entry) => {
    if (filters.status !== 'all' && entry.status !== filters.status) return false;
    if (
      filters.transaction_type !== 'all' &&
      entry.transaction_type !== filters.transaction_type
    ) {
      return false;
    }
    if (filters.source !== 'all' && entry.source !== filters.source) return false;
    if (filters.category_id && entry.category_id !== filters.category_id) return false;
    if (search) {
      const haystack = (entry.description ?? '').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}
