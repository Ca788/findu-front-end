import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  listCategoryTotals,
  type ListCategoryTotalsParams,
} from '@/features/categories/gateway/categories.gateway';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { CategoryTotal } from '@/features/categories/models/category.model';

export const CATEGORY_TOTALS_KEY = 'categories:totals';

export function useCategoryTotals(params: ListCategoryTotalsParams) {
  return useAppQuery<PaginatedSuccessResponse<CategoryTotal>>({
    queryKey: [CATEGORY_TOTALS_KEY, params],
    queryFn: () => listCategoryTotals(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
