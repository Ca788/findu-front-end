export interface SummaryByCategory {
  category_id: string | null;
  category_name: string | null;
  amount: string;
}

export interface SummaryByType {
  expense: string;
  income: string;
}

export interface Summary {
  total_amount: string;
  transaction_count: number;
  by_type: SummaryByType;
  by_category: SummaryByCategory[];
}

export interface SummaryFilters {
  from?: string;
  to?: string;
  transaction_type?: 'expense' | 'income';
  category_id?: string;
}
