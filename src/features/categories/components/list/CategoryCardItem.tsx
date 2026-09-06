'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Category } from '@/features/categories/models/category.model';
import { RowActions } from '@/components/common/RowActions';

interface CategoryCardItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCardItem({
  category,
  onEdit,
  onDelete,
}: CategoryCardItemProps) {
  return (
    <Paper className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
      <div className="min-w-0 flex-1">
        <Typography variant="body1" className="truncate font-medium">
          {category.name}
        </Typography>
        {category.whatsapp && (
          <Typography variant="caption" color="text.secondary">
            {category.whatsapp}
          </Typography>
        )}
      </div>
      <RowActions
        onEdit={() => onEdit(category)}
        onDelete={() => onDelete(category)}
      />
    </Paper>
  );
}
