'use client';

import { AxiosError } from 'axios';
import { useDeleteBudget } from '@/features/budgets/hooks/useDeleteBudget';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { formatBRL } from '@/utils/currency';
import { BUDGET_PERIOD_LABELS, type Budget } from '@/features/budgets/models/budget.model';

interface DeleteBudgetDialogProps {
  open: boolean;
  budget?: Budget;
  onClose: () => void;
}

export function DeleteBudgetDialog({ open, budget, onClose }: DeleteBudgetDialogProps) {
  const { showSuccess, showError } = useSnackbar();
  const { mutateAsync, isPending } = useDeleteBudget();

  const handleConfirm = async () => {
    if (!budget) return;
    try {
      await mutateAsync(budget.id);
      showSuccess('Orçamento removido');
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao remover orçamento');
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Remover orçamento"
      description={
        <>
          Tem certeza que deseja remover o orçamento{' '}
          <strong>
            {budget ? `${BUDGET_PERIOD_LABELS[budget.period_type]} · ${formatBRL(budget.limit_amount)}` : ''}
          </strong>?
        </>
      }
      confirmLabel="Remover"
      confirmColor="error"
      isLoading={isPending}
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  );
}
