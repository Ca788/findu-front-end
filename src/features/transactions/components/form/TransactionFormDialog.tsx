'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useCreateTransaction } from '@/features/transactions/hooks/useCreateTransaction';
import { useUpdateTransaction } from '@/features/transactions/hooks/useUpdateTransaction';
import { useUploadArtifact } from '@/features/artifacts/hooks/useUploadArtifact';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { FormDialog } from '@/components/common/FormDialog';
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
  transactionFormSchema,
  type TransactionFormValues,
} from '@/features/transactions/components/form/transactionFormSchema';
import { TransactionFormFields } from '@/features/transactions/components/form/TransactionFormFields';

interface TransactionFormDialogProps {
  open: boolean;
  transaction?: Transaction;
  onClose: () => void;
}

const DEFAULT_VALUES: TransactionFormValues = {
  amount: '',
  transaction_type: 'expense',
  description: '',
  occurred_at: '',
  category_id: '',
};

export function TransactionFormDialog({
  open,
  transaction,
  onClose,
}: TransactionFormDialogProps) {
  const isEdit = !!transaction;
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const uploadMutation = useUploadArtifact();
  const [file, setFile] = useState<File | null>(null);
  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    setFile(null);
    reset({
      amount: transaction?.amount ? String(transaction.amount).replace('.', ',') : '',
      transaction_type: transaction?.transaction_type ?? 'expense',
      description: transaction?.description ?? '',
      occurred_at: toLocalDateInput(transaction?.occurred_at),
      category_id: transaction?.category_id ?? '',
    });
  }, [open, transaction, reset]);

  const onSubmit = async (values: TransactionFormValues) => {
    try {
      let artifactId: string | null = null;
      if (file) {
        const artifact = await uploadMutation.mutateAsync({
          file,
          artifact_type: 'receipt',
          source: 'upload',
        });
        artifactId = artifact.id;
      }

      const input: TransactionInput = {
        amount: parseAmountInput(values.amount) ?? 0,
        transaction_type: values.transaction_type,
        description: values.description || null,
        occurred_at: toIsoDate(values.occurred_at),
        category_id: values.category_id || null,
        artifact_id: artifactId,
      };

      if (isEdit && transaction) {
        await updateMutation.mutateAsync({ id: transaction.id, input });
        showSuccess('Transação atualizada');
      } else {
        await createMutation.mutateAsync(input);
        showSuccess('Transação criada');
      }
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao salvar transação');
    }
  };

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Editar transação' : 'Nova transação'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
    >
      <TransactionFormFields
        control={control}
        register={register}
        errors={errors}
        file={file}
        onFileChange={setFile}
        showReceipt={!isEdit}
      />
    </FormDialog>
  );
}
