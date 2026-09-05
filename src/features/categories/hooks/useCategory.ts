import { useAppQuery } from '@/hooks/useAppQuery';
import { getCategory } from '@/features/categories/gateway/categories.gateway';
import type { Category } from '@/features/categories/models/category.model';

export const CATEGORY_KEY = 'categories:detail';

export function useCategory(id: string) {
  return useAppQuery<Category>({
    queryKey: [CATEGORY_KEY, id],
    queryFn: () => getCategory(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}
