import type { Category } from '@/features/categories/models/category.model';

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: string;
  transaction_type: TransactionType;
  description?: string | null;
  occurred_at?: string | null;
  category_id?: string | null;
  category?: Category | null;
  artifact_id?: string | null;
  metadata?: Record<string, unknown>;
  budget_warnings?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TransactionInput {
  amount: number;
  transaction_type: TransactionType;
  description?: string | null;
  occurred_at?: string | null;
  category_id?: string | null;
  artifact_id?: string | null;
}

export interface TransactionListFilters {
  transaction_type?: TransactionType;
  category_id?: string;
  from?: string;
  to?: string;
}
