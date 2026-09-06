'use client';

import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import type { CategoryFormValues } from '@/features/categories/components/form/categoryFormSchema';

interface CategoryFormFieldsProps {
  register: UseFormRegister<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
}

export function CategoryFormFields({ register, errors }: CategoryFormFieldsProps) {
  return (
    <>
      <TextField
        label="Nome"
        autoFocus
        fullWidth
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="WhatsApp"
        fullWidth
        sx={{ mt: 2 }}
        {...register('whatsapp')}
        error={!!errors.whatsapp}
        helperText={
          errors.whatsapp?.message ??
          'Número que recebe o comprovante do total pago nesta categoria.'
        }
      />
    </>
  );
}
