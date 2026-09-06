'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { FormDialog } from '@/components/common/FormDialog';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { currentMonthParam } from '@/features/statements/utils/month';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useCreateReceipt } from '@/features/receipts/hooks/useReceiptMutations';
import type { ReceiptInput } from '@/features/receipts/models/receipt.model';
import {
  receiptFormSchema,
  type ReceiptFormValues,
} from '@/features/receipts/components/receiptFormSchema';

interface ReceiptFormDialogProps {
  open: boolean;
  categoryId?: string;
  month?: string;
  onClose: () => void;
}

export function ReceiptFormDialog({
  open,
  categoryId,
  month,
  onClose,
}: ReceiptFormDialogProps) {
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateReceipt();
  const { data: categoriesData } = useCategories({ page: 1, perPage: 50 });
  const categories = categoriesData?.data ?? [];

  const defaultMonth = month || currentMonthParam();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      category_id: categoryId ?? '',
      from: defaultMonth,
      to: defaultMonth,
      transaction_type: 'expense',
      status: 'paid',
      deliver: true,
    },
  });

  const selectedId = watch('category_id');
  const selected = categories.find((category) => category.id === selectedId);

  useEffect(() => {
    if (!open) return;
    const nextMonth = month || currentMonthParam();
    reset({
      category_id: categoryId ?? '',
      from: nextMonth,
      to: nextMonth,
      transaction_type: 'expense',
      status: 'paid',
      deliver: true,
    });
  }, [open, categoryId, month, reset]);

  const onSubmit = async (values: ReceiptFormValues) => {
    if (!selected?.whatsapp) {
      showError('Cadastre o WhatsApp na categoria antes de enviar o comprovante');
      return;
    }

    try {
      const input: ReceiptInput = {
        category_id: values.category_id,
        from: values.from,
        to: values.to,
        deliver: values.deliver,
        transaction_type:
          values.transaction_type === 'all' ? null : values.transaction_type,
        status: values.status,
      };

      await createMutation.mutateAsync(input);
      showSuccess(
        values.deliver
          ? 'Comprovante gerado e enfileirado no WhatsApp'
          : 'Comprovante gerado',
      );
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao gerar comprovante');
    }
  };

  return (
    <FormDialog
      open={open}
      title="Enviar comprovante"
      submitLabel="Enviar"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={createMutation.isPending}
    >
      <Stack spacing={2}>
        <Controller
          name="category_id"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              select
              label="Categoria"
              fullWidth
              autoFocus
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              <MenuItem value="">
                <em>Selecione</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.whatsapp
                    ? category.name
                    : `${category.name} (sem WhatsApp)`}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Typography variant="body2" color="text.secondary">
          {selected?.whatsapp
            ? `WhatsApp: ${selected.whatsapp}`
            : 'Cadastre o WhatsApp na categoria para enviar o total pago.'}
        </Typography>
        <TextField
          label="De"
          type="month"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('from')}
          error={!!errors.from}
          helperText={errors.from?.message}
        />
        <TextField
          label="Até"
          type="month"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('to')}
          error={!!errors.to}
          helperText={errors.to?.message}
        />
        <Controller
          name="transaction_type"
          control={control}
          render={({ field }) => (
            <TextField select label="Tipo" fullWidth {...field}>
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="expense">Despesa</MenuItem>
              <MenuItem value="income">Receita</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField select label="Status" fullWidth {...field}>
              <MenuItem value="pending">Pendente</MenuItem>
              <MenuItem value="paid">Pago</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="deliver"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
              label="Enviar no WhatsApp"
            />
          )}
        />
      </Stack>
    </FormDialog>
  );
}
