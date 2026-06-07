import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import { listCategories } from '@/features/categories/gateway/categories.gateway';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { Category } from '@/features/categories/models/category.model';

export interface UseCategoriesParams {
  page: number;
  perPage: number;
}

export const CATEGORIES_LIST_KEY = 'categories:list';

export function useCategories(params: UseCategoriesParams) {
  return useAppQuery<PaginatedSuccessResponse<Category>>({
    queryKey: [CATEGORIES_LIST_KEY, params],
    queryFn: () => listCategories(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
