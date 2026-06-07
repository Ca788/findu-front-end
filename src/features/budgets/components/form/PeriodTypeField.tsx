'use client';

import { Controller, type Control } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import {
  BUDGET_PERIOD_LABELS,
  type BudgetPeriodType,
} from '@/features/budgets/models/budget.model';
import type { BudgetFormValues } from '@/features/budgets/components/form/budgetFormSchema';

interface PeriodTypeFieldProps {
  control: Control<BudgetFormValues>;
}

const ORDER: BudgetPeriodType[] = ['weekly', 'monthly', 'yearly', 'custom'];

export function PeriodTypeField({ control }: PeriodTypeFieldProps) {
  return (
    <Controller
      name="period_type"
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          select
          label="Período"
          fullWidth
          value={field.value}
          onChange={field.onChange}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        >
          {ORDER.map((type) => (
            <MenuItem key={type} value={type}>
              {BUDGET_PERIOD_LABELS[type]}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
