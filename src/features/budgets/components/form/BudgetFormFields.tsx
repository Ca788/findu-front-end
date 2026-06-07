'use client';

import {
  type Control,
  type UseFormRegister,
  type FieldErrors,
} from 'react-hook-form';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { PeriodTypeField } from '@/features/budgets/components/form/PeriodTypeField';
import type { BudgetFormValues } from '@/features/budgets/components/form/budgetFormSchema';

interface BudgetFormFieldsProps {
  control: Control<BudgetFormValues>;
  register: UseFormRegister<BudgetFormValues>;
  errors: FieldErrors<BudgetFormValues>;
}

export function BudgetFormFields({ control, register, errors }: BudgetFormFieldsProps) {
  return (
    <Stack spacing={2}>
      <PeriodTypeField control={control} />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Início"
          type="date"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('period_start')}
          error={!!errors.period_start}
          helperText={errors.period_start?.message}
        />
        <TextField
          label="Fim"
          type="date"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('period_end')}
          error={!!errors.period_end}
          helperText={errors.period_end?.message}
        />
      </div>
      <TextField
        label="Limite"
        placeholder="0,00"
        inputMode="decimal"
        fullWidth
        {...register('limit_amount')}
        error={!!errors.limit_amount}
        helperText={errors.limit_amount?.message ?? 'Use vírgula como separador decimal'}
      />
    </Stack>
  );
}
