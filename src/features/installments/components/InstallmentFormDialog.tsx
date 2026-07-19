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
import Typography from '@mui/material/Typography';
import { FormDialog } from '@/components/common/FormDialog';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { formatBRL, parseAmountInput } from '@/utils/currency';
import type {
  InstallmentPlan,
  InstallmentPlanInput,
  InstallmentPlanUpdateInput,
} from '@/features/installments/models/installment.model';
import {
  useCreateInstallmentPlan,
  useUpdateInstallmentPlan,
} from '@/features/installments/hooks/useInstallmentPlans';
import {
  installmentFormSchema,
  type InstallmentFormValues,
} from '@/features/installments/components/installmentFormSchema';

interface InstallmentFormDialogProps {
  open: boolean;
  plan?: InstallmentPlan | null;
  onClose: () => void;
}

const DEFAULT_VALUES: InstallmentFormValues = {
  description: '',
  transaction_type: 'expense',
  monthly_amount: '',
  total_installments: '5',
  first_competency: new Date().toISOString().slice(0, 10),
  category_id: '',
};

export function InstallmentFormDialog({ open, plan, onClose }: InstallmentFormDialogProps) {
  const isEdit = !!plan;
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateInstallmentPlan();
  const updateMutation = useUpdateInstallmentPlan();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const { data: categoriesData } = useCategories({ page: 1, perPage: 50 });
  const categories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<InstallmentFormValues>({
    resolver: zodResolver(installmentFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      description: plan?.description ?? '',
      transaction_type: plan?.transaction_type ?? 'expense',
      monthly_amount: plan?.monthly_amount
        ? String(plan.monthly_amount).replace('.', ',')
        : '',
      total_installments: plan?.total_installments
        ? String(plan.total_installments)
        : '5',
      first_competency: plan?.first_competency ?? new Date().toISOString().slice(0, 10),
      category_id: plan?.category_id ?? '',
    });
  }, [open, plan, reset]);

  const monthlyRaw = watch('monthly_amount');
  const countRaw = watch('total_installments');
  const preview =
    (parseAmountInput(monthlyRaw ?? '') ?? 0) * Number(countRaw || 0);

  const onSubmit = async (values: InstallmentFormValues) => {
    try {
      if (isEdit && plan) {
        const input: InstallmentPlanUpdateInput = {
          description: values.description || null,
          category_id: values.category_id || null,
          monthly_amount: parseAmountInput(values.monthly_amount) ?? undefined,
        };
        await updateMutation.mutateAsync({ id: plan.id, input });
        showSuccess('Parcelamento atualizado');
      } else {
        const input: InstallmentPlanInput = {
          description: values.description || null,
          transaction_type: values.transaction_type,
          monthly_amount: parseAmountInput(values.monthly_amount) ?? 0,
          total_installments: Number(values.total_installments),
          first_competency: values.first_competency,
          category_id: values.category_id || null,
        };
        await createMutation.mutateAsync(input);
        showSuccess('Parcelamento criado');
      }
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao salvar parcelamento');
    }
  };

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Editar parcelamento' : 'Novo parcelamento'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <Stack spacing={2}>
        <TextField
          label="Descrição"
          placeholder="Ex.: Celular, Notebook..."
          fullWidth
          autoFocus
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        {!isEdit && (
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
        )}
        <TextField
          label="Valor da parcela"
          placeholder="0,00"
          inputMode="decimal"
          fullWidth
          {...register('monthly_amount')}
          error={!!errors.monthly_amount}
          helperText={errors.monthly_amount?.message ?? 'Use vírgula como separador decimal'}
        />
        {!isEdit && (
          <TextField
            label="Quantidade de parcelas"
            type="number"
            fullWidth
            slotProps={{ htmlInput: { min: 1 } }}
            {...register('total_installments')}
            error={!!errors.total_installments}
            helperText={errors.total_installments?.message}
          />
        )}
        {!isEdit && (
          <TextField
            label="Mês da 1ª parcela"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('first_competency')}
            error={!!errors.first_competency}
            helperText={errors.first_competency?.message ?? 'A parcela cai no mês desta data'}
          />
        )}
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
        {!isEdit && preview > 0 && (
          <Typography variant="caption" color="text.secondary">
            Total: {formatBRL(preview)}
          </Typography>
        )}
      </Stack>
    </FormDialog>
  );
}
