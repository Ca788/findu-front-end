export type BudgetPeriodType = 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Budget {
  id: string;
  period_type: BudgetPeriodType;
  period_start: string;
  period_end: string;
  limit_amount: string;
  spent_amount?: string;
  remaining?: string;
  usage_percent?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BudgetInput {
  period_type: BudgetPeriodType;
  period_start: string;
  period_end: string;
  limit_amount: number;
}

export interface BudgetListFilters {
  period_type?: BudgetPeriodType;
}

export const BUDGET_PERIOD_LABELS: Record<BudgetPeriodType, string> = {
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
  custom: 'Personalizado',
};
