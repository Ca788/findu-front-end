'use client';

import {
  type Control,
  type UseFormRegister,
  type FieldErrors,
} from 'react-hook-form';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PeriodTypeField } from '@/features/budgets/components/form/PeriodTypeField';
import type { BudgetFormValues } from '@/features/budgets/components/form/budgetFormSchema';
import { MoneyField } from '@/components/common/MoneyField';

interface BudgetFormFieldsProps {
  control: Control<BudgetFormValues>;
  register: UseFormRegister<BudgetFormValues>;
  errors: FieldErrors<BudgetFormValues>;
}

export function BudgetFormFields({ control, register, errors }: BudgetFormFieldsProps) {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Qual o limite deste período?
        </Typography>
        <MoneyField
          label="Limite"
          emphasize
          {...register('limit_amount')}
          error={!!errors.limit_amount}
          helperText={errors.limit_amount?.message}
        />
      </Stack>

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
    </Stack>
  );
}
