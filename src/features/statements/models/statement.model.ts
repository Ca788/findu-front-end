import type { Transaction } from '@/features/transactions/models/transaction.model';
import type { RecurrenceRule } from '@/features/recurrences/models/recurrence.model';
import type { InstallmentPlan } from '@/features/installments/models/installment.model';

export interface StatementForecast {
  income: string;
  expense: string;
  balance: string;
}

export interface StatementActual {
  income_paid: string;
  expense_paid: string;
  balance: string;
}

export interface StatementCounts {
  pending: number;
  paid: number;
  total: number;
}

export interface StatementByCategory {
  category_id: string | null;
  category_name: string | null;
  forecast: string;
  paid: string;
}

export interface Statement {
  month: string; // "YYYY-MM"
  forecast: StatementForecast;
  actual: StatementActual;
  counts: StatementCounts;
  entries: Transaction[];
  installments_active: InstallmentPlan[];
  recurrences_active: RecurrenceRule[];
  by_category: StatementByCategory[];
}

export interface StatementSummary {
  month: string; // "YYYY-MM"
  income_forecast: string;
  expense_forecast: string;
  balance_forecast: string;
  income_paid: string;
  expense_paid: string;
  balance_actual: string;
  pending_count: number;
  paid_count: number;
}

export interface StatementListFilters {
  from?: string; // "YYYY-MM" or "YYYY-MM-DD"
  to?: string;
}
