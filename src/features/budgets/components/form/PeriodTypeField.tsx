'use client';

import { Controller, type Control } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
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
        <FormControl error={!!fieldState.error} fullWidth>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            Período
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={field.value}
            onChange={(_, next) => next && field.onChange(next)}
            fullWidth
            size="small"
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              '& .MuiToggleButtonGroup-grouped': {
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '14px !important',
                margin: 0,
                py: 1.1,
              },
            }}
          >
            {ORDER.map((type) => (
              <ToggleButton key={type} value={type}>
                {BUDGET_PERIOD_LABELS[type]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {fieldState.error?.message && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
