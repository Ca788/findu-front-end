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
import { FormDialog } from '@/components/common/FormDialog';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { currentMonthParam } from '@/features/statements/utils/month';
import { useCreateReceipt } from '@/features/receipts/hooks/useReceiptMutations';
import type { ReceiptInput } from '@/features/receipts/models/receipt.model';
import {
  receiptFormSchema,
  type ReceiptFormValues,
} from '@/features/receipts/components/receiptFormSchema';

interface ReceiptFormDialogProps {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_VALUES: ReceiptFormValues = {
  payer_phone: '',
  payer_name: '',
  from: currentMonthParam(),
  to: currentMonthParam(),
  transaction_type: 'all',
  status: 'all',
  deliver: true,
};

export function ReceiptFormDialog({ open, onClose }: ReceiptFormDialogProps) {
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateReceipt();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      ...DEFAULT_VALUES,
      from: currentMonthParam(),
      to: currentMonthParam(),
    });
  }, [open, reset]);

  const onSubmit = async (values: ReceiptFormValues) => {
    try {
      const input: ReceiptInput = {
        payer_phone: values.payer_phone.trim(),
        payer_name: values.payer_name?.trim() || null,
        from: values.from,
        to: values.to,
        deliver: values.deliver,
        transaction_type:
          values.transaction_type === 'all' ? null : values.transaction_type,
        status: values.status === 'all' ? null : values.status,
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
      title="Novo comprovante"
      submitLabel="Gerar"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={createMutation.isPending}
    >
      <Stack spacing={2}>
        <TextField
          label="WhatsApp do pagador"
          fullWidth
          autoFocus
          {...register('payer_phone')}
          error={!!errors.payer_phone}
          helperText={errors.payer_phone?.message}
        />
        <TextField
          label="Nome do pagador"
          fullWidth
          {...register('payer_name')}
          error={!!errors.payer_name}
          helperText={errors.payer_name?.message}
        />
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
              <MenuItem value="all">Todos</MenuItem>
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
