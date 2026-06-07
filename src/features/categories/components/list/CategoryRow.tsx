'use client';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { Category } from '@/features/categories/models/category.model';
import { CategoryRowActions } from '@/features/categories/components/list/CategoryRowActions';

interface CategoryRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryRow({ category, onEdit, onDelete }: CategoryRowProps) {
  return (
    <TableRow hover>
      <TableCell>{category.name}</TableCell>
      <TableCell align="right" width={120}>
        <CategoryRowActions
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category)}
        />
      </TableCell>
    </TableRow>
  );
}
