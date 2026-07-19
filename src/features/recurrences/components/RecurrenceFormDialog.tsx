'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { FormDialog } from '@/components/common/FormDialog';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { parseAmountInput } from '@/utils/currency';
import type {
  RecurrenceRule,
  RecurrenceRuleInput,
} from '@/features/recurrences/models/recurrence.model';
import {
  useCreateRecurrence,
  useUpdateRecurrence,
} from '@/features/recurrences/hooks/useRecurrences';
import {
  recurrenceFormSchema,
  type RecurrenceFormValues,
} from '@/features/recurrences/components/recurrenceFormSchema';

interface RecurrenceFormDialogProps {
  open: boolean;
  rule?: RecurrenceRule | null;
  onClose: () => void;
}

const DEFAULT_VALUES: RecurrenceFormValues = {
  transaction_type: 'expense',
  amount: '',
  description: '',
  day_of_month: '',
  starts_on: new Date().toISOString().slice(0, 10),
  ends_on: '',
  category_id: '',
};

export function RecurrenceFormDialog({ open, rule, onClose }: RecurrenceFormDialogProps) {
  const isEdit = !!rule;
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateRecurrence();
  const updateMutation = useUpdateRecurrence();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const { data: categoriesData } = useCategories({ page: 1, perPage: 50 });
  const categories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RecurrenceFormValues>({
    resolver: zodResolver(recurrenceFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      transaction_type: rule?.transaction_type ?? 'expense',
      amount: rule?.amount ? String(rule.amount).replace('.', ',') : '',
      description: rule?.description ?? '',
      day_of_month: rule?.day_of_month ? String(rule.day_of_month) : '',
      starts_on: rule?.starts_on ?? new Date().toISOString().slice(0, 10),
      ends_on: rule?.ends_on ?? '',
      category_id: rule?.category_id ?? '',
    });
  }, [open, rule, reset]);

  const onSubmit = async (values: RecurrenceFormValues) => {
    try {
      const input: RecurrenceRuleInput = {
        transaction_type: values.transaction_type,
        amount: parseAmountInput(values.amount) ?? 0,
        description: values.description || null,
        day_of_month: values.day_of_month ? Number(values.day_of_month) : null,
        starts_on: values.starts_on,
        ends_on: values.ends_on || null,
        category_id: values.category_id || null,
      };

      if (isEdit && rule) {
        await updateMutation.mutateAsync({ id: rule.id, input });
        showSuccess('Recorrência atualizada');
      } else {
        await createMutation.mutateAsync(input);
        showSuccess('Recorrência criada');
      }
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao salvar recorrência');
    }
  };

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Editar recorrência' : 'Nova recorrência'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <Stack spacing={2}>
        <Controller
          name="transaction_type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
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
            </FormControl>
          )}
        />
        <TextField
          label="Valor"
          placeholder="0,00"
          inputMode="decimal"
          fullWidth
          {...register('amount')}
          error={!!errors.amount}
          helperText={errors.amount?.message ?? 'Use vírgula como separador decimal'}
        />
        <TextField
          label="Descrição"
          placeholder="Ex.: Aluguel, Internet, Salário..."
          fullWidth
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          label="Dia do mês (opcional)"
          type="number"
          fullWidth
          slotProps={{ htmlInput: { min: 1, max: 31 } }}
          {...register('day_of_month')}
          error={!!errors.day_of_month}
          helperText={errors.day_of_month?.message ?? 'Se vazio, usa o dia da data de início'}
        />
        <TextField
          label="Início"
          type="date"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('starts_on')}
          error={!!errors.starts_on}
          helperText={errors.starts_on?.message}
        />
        <TextField
          label="Fim (opcional)"
          type="date"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('ends_on')}
          error={!!errors.ends_on}
          helperText={errors.ends_on?.message ?? 'Deixe vazio para recorrer indefinidamente'}
        />
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Categoria"
              fullWidth
              value={field.value ?? ''}
              onChange={field.onChange}
            >
              <MenuItem value=""><em>Sem categoria</em></MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Stack>
    </FormDialog>
  );
}
