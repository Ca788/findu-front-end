'use client';

import { Controller, type Control } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { TransactionFormValues } from '@/features/transactions/components/form/transactionFormSchema';

interface CategorySelectFieldProps {
  control: Control<TransactionFormValues>;
}

export function CategorySelectField({ control }: CategorySelectFieldProps) {
  const { data, isLoading } = useCategories({ page: 1, perPage: 50 });
  const categories = data?.data ?? [];

  return (
    <Controller
      name="category_id"
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          select
          label="Categoria"
          fullWidth
          value={field.value ?? ''}
          onChange={field.onChange}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          disabled={isLoading}
        >
          <MenuItem value="">
            <em>Sem categoria</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
