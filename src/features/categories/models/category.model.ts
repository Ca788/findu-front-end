export type SerializerView = 'default' | 'extended';
export type TransactionTypeFilter = 'expense' | 'income';
export type TransactionStatusFilter = 'pending' | 'paid';

export interface Category {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryInput {
  name: string;
}

export interface CategoryTotal {
  category_id: string | null;
  category_name: string;
  income: string;
  expense: string;
  balance: string;
  total: string;
  paid_amount?: string;
  pending_amount?: string;
  transactions_count?: number;
}

export interface CategoryPeriodFilters {
  from?: string;
  to?: string;
  transaction_type?: TransactionTypeFilter;
  status?: TransactionStatusFilter;
  payer_phone?: string;
  view?: SerializerView;
}
