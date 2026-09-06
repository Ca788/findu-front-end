'use client';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { Category } from '@/features/categories/models/category.model';
import { RowActions } from '@/components/common/RowActions';

interface CategoryRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryRow({ category, onEdit, onDelete }: CategoryRowProps) {
  return (
    <TableRow hover>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.whatsapp || '—'}</TableCell>
      <TableCell align="right" width={120}>
        <RowActions
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category)}
        />
      </TableCell>
    </TableRow>
  );
}
