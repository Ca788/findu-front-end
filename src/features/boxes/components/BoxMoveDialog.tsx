'use client';

import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { FormDialog } from '@/components/common/FormDialog';
import { MoneyField } from '@/components/common/MoneyField';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppErrorResultMapper, type ErrorResponse } from '@/infrastructure/AppResponse';
import { formatBRL, parseAmountInput } from '@/utils/currency';
import { useMoveBoxFunds } from '@/features/boxes/hooks/useBoxes';
import { BoxIllustrationView } from '@/features/boxes/components/BoxIllustrationView';
import {
  boxMovementFormSchema,
  type BoxMovementFormValues,
} from '@/features/boxes/components/boxFormSchema';
import {
  BOX_MOVEMENT_KINDS,
  BOX_MOVEMENT_LABELS,
  type Box,
  type BoxMoveResult,
  type BoxMovementKind,
} from '@/features/boxes/models/box.model';

interface BoxMoveDialogProps {
  open: boolean;
  box?: Box;
  onClose: () => void;
  onMoved?: (result: BoxMoveResult) => void;
}

const SUBMIT_LABELS: Record<BoxMovementKind, string> = {
  deposit: 'Guardar',
  withdraw: 'Resgatar',
  adjustment: 'Ajustar saldo',
};

export function BoxMoveDialog({ open, box, onClose, onMoved }: BoxMoveDialogProps) {
  const { showSuccess, showError } = useSnackbar();
  const mutation = useMoveBoxFunds();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BoxMovementFormValues>({
    resolver: zodResolver(boxMovementFormSchema),
    defaultValues: { kind: 'deposit', amount: '', description: '' },
  });

  const kind = useWatch({ control, name: 'kind' });

  useEffect(() => {
    if (!open) return;
    reset({ kind: 'deposit', amount: '', description: '' });
  }, [open, box, reset]);

  const onSubmit = async (values: BoxMovementFormValues) => {
    if (!box) return;
    const amount = parseAmountInput(values.amount) ?? 0;
    if (values.kind !== 'adjustment' && amount <= 0) {
      showError('Informe um valor maior que zero');
      return;
    }
    try {
      const result = await mutation.mutateAsync({
        id: box.id,
        input: {
          kind: values.kind,
          amount,
          description: values.description?.trim() || undefined,
        },
      });
      showSuccess(`${BOX_MOVEMENT_LABELS[values.kind]} registrado`);
      onMoved?.(result);
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(err as AxiosError<ErrorResponse>);
      showError(mapped.data.message ?? 'Erro ao movimentar caixinha');
    }
  };

  return (
    <FormDialog
      open={open}
      title={box ? box.name : 'Movimentar'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={mutation.isPending}
      submitLabel={SUBMIT_LABELS[kind]}
      maxWidth="xs"
    >
      <Stack spacing={2.5}>
        <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
          <BoxIllustrationView illustrationKey={box?.illustration_key} size={120} />
          <Typography variant="caption" color="text.secondary">
            Saldo atual
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {formatBRL(box?.balance)}
          </Typography>
        </Stack>
        <Controller
          name="kind"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={field.value}
              onChange={(_event, next: BoxMovementKind | null) => {
                if (next) field.onChange(next);
              }}
            >
              {BOX_MOVEMENT_KINDS.map((item) => (
                <ToggleButton key={item} value={item}>
                  {BOX_MOVEMENT_LABELS[item]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <MoneyField
              label={kind === 'adjustment' ? 'Novo saldo' : 'Valor'}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          )}
        />
        <TextField label="Descrição (opcional)" {...register('description')} fullWidth />
      </Stack>
    </FormDialog>
  );
}
