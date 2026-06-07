import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategory } from '@/features/categories/gateway/categories.gateway';
import { CATEGORIES_LIST_KEY } from '@/features/categories/hooks/useCategories';
import type { CategoryInput } from '@/features/categories/models/category.model';

interface UpdateCategoryArgs {
  id: string;
  input: CategoryInput;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateCategoryArgs) => updateCategory(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_LIST_KEY] });
    },
  });
}
