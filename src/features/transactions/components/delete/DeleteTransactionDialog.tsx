'use client';

import { AxiosError } from 'axios';
import { useDeleteTransaction } from '@/features/transactions/hooks/useDeleteTransaction';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { formatBRL } from '@/utils/currency';
import type { Transaction } from '@/features/transactions/models/transaction.model';

interface DeleteTransactionDialogProps {
  open: boolean;
  transaction?: Transaction;
  onClose: () => void;
}

export function DeleteTransactionDialog({
  open,
  transaction,
  onClose,
}: DeleteTransactionDialogProps) {
  const { showSuccess, showError } = useSnackbar();
  const { mutateAsync, isPending } = useDeleteTransaction();

  const handleConfirm = async () => {
    if (!transaction) return;
    try {
      await mutateAsync(transaction.id);
      showSuccess('Transação removida');
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao remover transação');
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title="Remover transação"
      description={
        <>
          Tem certeza que deseja remover a transação de{' '}
          <strong>{formatBRL(transaction?.amount)}</strong>?
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
