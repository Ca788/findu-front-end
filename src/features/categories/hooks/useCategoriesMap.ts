import { useMemo } from 'react';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { Category } from '@/features/categories/models/category.model';

export function useCategoriesMap() {
  const query = useCategories({ page: 1, perPage: 50 });

  const map = useMemo(() => {
    const next = new Map<string, Category>();
    query.data?.data.forEach((category) => next.set(category.id, category));
    return next;
  }, [query.data]);

  const resolveName = (id?: string | null): string | null =>
    id ? (map.get(id)?.name ?? null) : null;

  return { map, resolveName, isLoading: query.isLoading };
}
