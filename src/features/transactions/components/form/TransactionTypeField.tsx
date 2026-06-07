'use client';

import { Controller, type Control } from 'react-hook-form';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import type { TransactionFormValues } from '@/features/transactions/components/form/transactionFormSchema';

interface TransactionTypeFieldProps {
  control: Control<TransactionFormValues>;
}

export function TransactionTypeField({ control }: TransactionTypeFieldProps) {
  return (
    <Controller
      name="transaction_type"
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error} fullWidth>
          <InputLabel shrink className="static -ml-3 mb-1">Tipo</InputLabel>
          <ToggleButtonGroup
            exclusive
            value={field.value}
            onChange={(_, next) => next && field.onChange(next)}
            fullWidth
            size="small"
          >
            <ToggleButton value="expense" color="error">Despesa</ToggleButton>
            <ToggleButton value="income" color="success">Receita</ToggleButton>
          </ToggleButtonGroup>
          {fieldState.error?.message && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
