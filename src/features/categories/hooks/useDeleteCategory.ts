import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory } from '@/features/categories/gateway/categories.gateway';
import { CATEGORIES_LIST_KEY } from '@/features/categories/hooks/useCategories';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_LIST_KEY] });
    },
  });
}
