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
import FormHelperText from '@mui/material/FormHelperText';
import { FormDialog } from '@/components/common/FormDialog';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { parseAmountInput } from '@/utils/currency';
import { toIsoDate, toLocalDateInput } from '@/utils/date';
import type {
  Transaction,
  TransactionInput,
} from '@/features/transactions/models/transaction.model';
import {
  useCreateEntry,
  useUpdateEntry,
} from '@/features/statements/hooks/useEntryMutations';
import {
  entryFormSchema,
  type EntryFormValues,
} from '@/features/statements/components/entryFormSchema';
import { MoneyField } from '@/components/common/MoneyField';

interface EntryFormDialogProps {
  open: boolean;
  month: string;
  entry?: Transaction | null;
  onClose: () => void;
}

const DEFAULT_VALUES: EntryFormValues = {
  amount: '',
  transaction_type: 'expense',
  status: 'pending',
  description: '',
  occurred_at: '',
  category_id: '',
};

export function EntryFormDialog({ open, month, entry, onClose }: EntryFormDialogProps) {
  const isEdit = !!entry;
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateEntry(month);
  const updateMutation = useUpdateEntry(month);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isGenerated = !!(entry && entry.source !== 'manual');

  const { data: categoriesData } = useCategories({ page: 1, perPage: 50 });
  const categories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      amount: entry?.amount ? String(entry.amount).replace('.', ',') : '',
      transaction_type: entry?.transaction_type ?? 'expense',
      status: entry?.status ?? 'pending',
      description: entry?.description ?? '',
      occurred_at: toLocalDateInput(entry?.occurred_at),
      category_id: entry?.category_id ?? '',
    });
  }, [open, entry, reset]);

  const onSubmit = async (values: EntryFormValues) => {
    try {
      const input: TransactionInput = {
        amount: parseAmountInput(values.amount) ?? 0,
        transaction_type: values.transaction_type,
        status: values.status,
        description: values.description || null,
        occurred_at: toIsoDate(values.occurred_at),
        category_id: values.category_id || null,
      };

      if (isEdit && entry) {
        await updateMutation.mutateAsync({ id: entry.id, input });
        showSuccess('Lançamento atualizado');
      } else {
        await createMutation.mutateAsync(input);
        showSuccess('Lançamento criado');
      }
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao salvar lançamento');
    }
  };

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Editar lançamento' : 'Novo lançamento'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <Stack spacing={2}>
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
                size="medium"
                disabled={isGenerated}
              >
                <ToggleButton value="expense" color="error" sx={{ flex: 1 }}>
                  Despesa
                </ToggleButton>
                <ToggleButton value="income" color="success" sx={{ flex: 1 }}>
                  Receita
                </ToggleButton>
              </ToggleButtonGroup>
              {fieldState.error?.message && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
        <MoneyField
          label="Valor"
          emphasize
          autoFocus
          {...register('amount')}
          error={!!errors.amount}
          helperText={
            errors.amount?.message ??
            (isGenerated
              ? 'Editar aqui só altera este mês; a regra original não muda.'
              : undefined)
          }
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel shrink className="static -ml-3 mb-1">Status</InputLabel>
              <ToggleButtonGroup
                exclusive
                value={field.value}
                onChange={(_, next) => next && field.onChange(next)}
                fullWidth
                size="medium"
              >
                <ToggleButton value="pending" sx={{ flex: 1 }}>
                  Pendente
                </ToggleButton>
                <ToggleButton value="paid" color="success" sx={{ flex: 1 }}>
                  Pago
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          )}
        />
        <TextField
          label="Descrição"
          fullWidth
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <TextField
          label="Data"
          type="date"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('occurred_at')}
          error={!!errors.occurred_at}
          helperText={errors.occurred_at?.message}
        />
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
      </Stack>
    </FormDialog>
  );
}
