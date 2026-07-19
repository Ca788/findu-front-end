import type { Category } from '@/features/categories/models/category.model';
import type { TransactionType } from '@/features/transactions/models/transaction.model';

export type InstallmentPlanStatus = 'active' | 'completed' | 'canceled';

export interface InstallmentPlan {
  id: string;
  description?: string | null;
  transaction_type: TransactionType;
  category_id?: string | null;
  category?: Category | null;
  total_installments: number;
  monthly_amount: string;
  total_amount: string;
  first_competency: string; // "YYYY-MM-DD"
  status: InstallmentPlanStatus;
  paid_count: number;
  remaining_count: number;
  paid_amount: string;
  remaining_amount: string;
  end_competency?: string | null;
  started_at?: string | null;
  canceled_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface InstallmentPlanInput {
  description?: string | null;
  transaction_type?: TransactionType;
  category_id?: string | null;
  total_installments: number;
  monthly_amount: number;
  first_competency: string; // "YYYY-MM-DD" (dia 01 do mês da 1ª parcela)
}

export interface InstallmentPlanUpdateInput {
  description?: string | null;
  category_id?: string | null;
  monthly_amount?: number;
}
