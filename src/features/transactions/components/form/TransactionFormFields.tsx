'use client';

import {
  type Control,
  type UseFormRegister,
  type FieldErrors,
} from 'react-hook-form';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { TransactionTypeField } from '@/features/transactions/components/form/TransactionTypeField';
import { CategorySelectField } from '@/features/transactions/components/form/CategorySelectField';
import { ReceiptField } from '@/features/transactions/components/form/ReceiptField';
import type { TransactionFormValues } from '@/features/transactions/components/form/transactionFormSchema';

interface TransactionFormFieldsProps {
  control: Control<TransactionFormValues>;
  register: UseFormRegister<TransactionFormValues>;
  errors: FieldErrors<TransactionFormValues>;
  file: File | null;
  onFileChange: (file: File | null) => void;
  showReceipt: boolean;
}

export function TransactionFormFields({
  control,
  register,
  errors,
  file,
  onFileChange,
  showReceipt,
}: TransactionFormFieldsProps) {
  return (
    <Stack spacing={2}>
      <TransactionTypeField control={control} />
      <TextField
        label="Valor"
        placeholder="0,00"
        inputMode="decimal"
        autoFocus
        fullWidth
        {...register('amount')}
        error={!!errors.amount}
        helperText={errors.amount?.message ?? 'Use vírgula como separador decimal'}
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
      <CategorySelectField control={control} />
      {showReceipt && (
        <ReceiptField file={file} onChange={onFileChange} />
      )}
    </Stack>
  );
}
