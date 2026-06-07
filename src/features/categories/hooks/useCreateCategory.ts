import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '@/features/categories/gateway/categories.gateway';
import { CATEGORIES_LIST_KEY } from '@/features/categories/hooks/useCategories';
import type { CategoryInput } from '@/features/categories/models/category.model';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_LIST_KEY] });
    },
  });
}
