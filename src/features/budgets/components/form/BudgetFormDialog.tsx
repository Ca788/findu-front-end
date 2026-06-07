'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useCreateBudget } from '@/features/budgets/hooks/useCreateBudget';
import { useUpdateBudget } from '@/features/budgets/hooks/useUpdateBudget';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { FormDialog } from '@/components/common/FormDialog';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { parseAmountInput } from '@/utils/currency';
import { toLocalDateInput } from '@/utils/date';
import type {
  Budget,
  BudgetInput,
} from '@/features/budgets/models/budget.model';
import {
  budgetFormSchema,
  type BudgetFormValues,
} from '@/features/budgets/components/form/budgetFormSchema';
import { BudgetFormFields } from '@/features/budgets/components/form/BudgetFormFields';

interface BudgetFormDialogProps {
  open: boolean;
  budget?: Budget;
  onClose: () => void;
}

const DEFAULT_VALUES: BudgetFormValues = {
  period_type: 'monthly',
  period_start: '',
  period_end: '',
  limit_amount: '',
};

export function BudgetFormDialog({ open, budget, onClose }: BudgetFormDialogProps) {
  const isEdit = !!budget;
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      period_type: budget?.period_type ?? 'monthly',
      period_start: toLocalDateInput(budget?.period_start),
      period_end: toLocalDateInput(budget?.period_end),
      limit_amount: budget?.limit_amount
        ? String(budget.limit_amount).replace('.', ',')
        : '',
    });
  }, [open, budget, reset]);

  const onSubmit = async (values: BudgetFormValues) => {
    try {
      const input: BudgetInput = {
        period_type: values.period_type,
        period_start: values.period_start,
        period_end: values.period_end,
        limit_amount: parseAmountInput(values.limit_amount) ?? 0,
      };

      if (isEdit && budget) {
        await updateMutation.mutateAsync({ id: budget.id, input });
        showSuccess('Orçamento atualizado');
      } else {
        await createMutation.mutateAsync(input);
        showSuccess('Orçamento criado');
      }
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao salvar orçamento');
    }
  };

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Editar orçamento' : 'Novo orçamento'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      maxWidth="xs"
    >
      <BudgetFormFields control={control} register={register} errors={errors} />
    </FormDialog>
  );
}
