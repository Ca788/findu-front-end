import type { Category } from '@/features/categories/models/category.model';
import type { TransactionType } from '@/features/transactions/models/transaction.model';

export type RecurrenceFrequency = 'monthly';

export interface RecurrenceRule {
  id: string;
  transaction_type: TransactionType;
  amount: string;
  description?: string | null;
  frequency: RecurrenceFrequency;
  day_of_month?: number | null;
  starts_on: string; // "YYYY-MM-DD"
  ends_on?: string | null;
  active: boolean;
  category_id?: string | null;
  category?: Category | null;
  canceled_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RecurrenceRuleInput {
  transaction_type: TransactionType;
  amount: number;
  description?: string | null;
  frequency?: RecurrenceFrequency;
  day_of_month?: number | null;
  starts_on: string;
  ends_on?: string | null;
  category_id?: string | null;
}
