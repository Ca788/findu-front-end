'use client';

import type { Category } from '@/features/categories/models/category.model';
import { CategoryCardItem } from '@/features/categories/components/list/CategoryCardItem';
import { EmptyState } from '@/components/common/EmptyState';

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
      <EmptyState
        variant="card"
        illustration="briefcase"
        title="Nenhuma categoria ainda"
        description="Crie categorias como Mercado, Transporte ou Lazer para organizar os lançamentos."
      />
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
