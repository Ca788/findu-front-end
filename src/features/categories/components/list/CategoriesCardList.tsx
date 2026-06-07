'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Category } from '@/features/categories/models/category.model';
import { CategoryCardItem } from '@/features/categories/components/list/CategoryCardItem';

interface CategoriesCardListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesCardList({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoriesCardListProps) {
  if (!isLoading && categories.length === 0) {
    return (
      <Paper className="rounded-2xl px-4 py-10 text-center">
        <Typography variant="body2" color="text.secondary">
          Nenhuma categoria cadastrada.
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {categories.map((category) => (
        <CategoryCardItem
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
