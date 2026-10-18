'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FormDialog } from '@/components/common/FormDialog';
import { MoneyField } from '@/components/common/MoneyField';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { formatAmountForInput, parseAmountInput } from '@/utils/currency';
import { localTodayInput, toLocalDateInput } from '@/utils/date';
import {
  useCreateInvestment,
  useUpdateInvestment,
} from '@/features/investments/hooks/useInvestments';
import {
  INVESTMENT_ASSET_LABELS,
  INVESTMENT_STATUS_LABELS,
  type Investment,
  type InvestmentAssetType,
  type InvestmentInput,
  type InvestmentStatus,
} from '@/features/investments/models/investment.model';
import {
  investmentFormSchema,
  type InvestmentFormValues,
} from '@/features/investments/components/investmentFormSchema';

interface InvestmentFormDialogProps {
  open: boolean;
  investment?: Investment;
  onClose: () => void;
}

const ASSET_TYPES = Object.keys(INVESTMENT_ASSET_LABELS) as InvestmentAssetType[];
const STATUSES = Object.keys(INVESTMENT_STATUS_LABELS) as InvestmentStatus[];

function defaultValues(): InvestmentFormValues {
  return {
    name: '',
    asset_type: 'fixed_income',
    institution: '',
    invested_amount: '',
    current_amount: '',
    invested_on: localTodayInput(),
    status: 'active',
    notes: '',
  };
}

export function InvestmentFormDialog({
  open,
  investment,
  onClose,
}: InvestmentFormDialogProps) {
  const isEdit = !!investment;
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateInvestment();
  const updateMutation = useUpdateInvestment();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: defaultValues(),
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: investment?.name ?? '',
      asset_type: investment?.asset_type ?? 'fixed_income',
      institution: investment?.institution ?? '',
      invested_amount: formatAmountForInput(investment?.invested_amount),
      current_amount: formatAmountForInput(investment?.current_amount),
      invested_on: toLocalDateInput(investment?.invested_on) || localTodayInput(),
      status: investment?.status ?? 'active',
      notes: investment?.notes ?? '',
    });
  }, [open, investment, reset]);

  const onSubmit = async (values: InvestmentFormValues) => {
    try {
      const invested = parseAmountInput(values.invested_amount) ?? 0;
      const current = parseAmountInput(values.current_amount ?? '') ?? invested;
      const input: InvestmentInput = {
        name: values.name.trim(),
        asset_type: values.asset_type,
        institution: values.institution?.trim() || undefined,
        invested_amount: invested,
        current_amount: current,
        invested_on: values.invested_on,
        status: values.status,
        notes: values.notes?.trim() || undefined,
      };

      if (isEdit && investment) {
        await updateMutation.mutateAsync({ id: investment.id, input });
        showSuccess('Investimento atualizado');
      } else {
        await createMutation.mutateAsync(input);
        showSuccess('Investimento criado');
      }
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao salvar investimento');
    }
  };

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Editar investimento' : 'Novo investimento'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      maxWidth="xs"
    >
      <Stack spacing={2}>
        <TextField
          label="Nome"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />
        <Controller
          name="asset_type"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Tipo"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!errors.asset_type}
              helperText={errors.asset_type?.message}
              fullWidth
            >
              {ASSET_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {INVESTMENT_ASSET_LABELS[type]}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <TextField
          label="Instituição"
          {...register('institution')}
          fullWidth
        />
        <Controller
          name="invested_amount"
          control={control}
          render={({ field }) => (
            <MoneyField
              label="Valor investido"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!errors.invested_amount}
              helperText={errors.invested_amount?.message}
            />
          )}
        />
        <Controller
          name="current_amount"
          control={control}
          render={({ field }) => (
            <MoneyField
              label="Valor atual"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!errors.current_amount}
              helperText={errors.current_amount?.message}
            />
          )}
        />
        <TextField
          label="Aplicado em"
          type="date"
          {...register('invested_on')}
          error={!!errors.invested_on}
          helperText={errors.invested_on?.message}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Status"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!errors.status}
              helperText={errors.status?.message}
              fullWidth
            >
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {INVESTMENT_STATUS_LABELS[status]}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <TextField
          label="Notas"
          {...register('notes')}
          fullWidth
          multiline
          minRows={2}
        />
      </Stack>
    </FormDialog>
  );
}
