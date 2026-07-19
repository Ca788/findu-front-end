import type { Category } from '@/features/categories/models/category.model';

export type TransactionType = 'expense' | 'income';
export type TransactionStatus = 'pending' | 'paid';
export type TransactionSource = 'manual' | 'recurrence' | 'installment';

export interface Transaction {
  id: string;
  amount: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  competency_month: string; // "YYYY-MM-DD" (always day 01)
  paid_at?: string | null;
  source: TransactionSource;
  description?: string | null;
  occurred_at?: string | null;
  category_id?: string | null;
  category?: Category | null;
  artifact_id?: string | null;
  installment_plan_id?: string | null;
  installment_number?: number | null;
  recurrence_rule_id?: string | null;
  metadata?: Record<string, unknown>;
  budget_warnings?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TransactionInput {
  amount: number;
  transaction_type: TransactionType;
  status?: TransactionStatus;
  competency_month?: string | null; // "YYYY-MM" or "YYYY-MM-DD"
  description?: string | null;
  occurred_at?: string | null;
  category_id?: string | null;
  artifact_id?: string | null;
}

export type Entry = Transaction;
export type EntryInput = TransactionInput;
