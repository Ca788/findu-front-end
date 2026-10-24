'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormDialog } from '@/components/common/FormDialog';
import { MoneyField } from '@/components/common/MoneyField';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppErrorResultMapper, type ErrorResponse } from '@/infrastructure/AppResponse';
import { formatAmountForInput, parseAmountInput } from '@/utils/currency';
import { useCreateBox, useUpdateBox } from '@/features/boxes/hooks/useBoxes';
import { getBoxIllustration } from '@/features/boxes/constants/boxCatalog';
import { BoxIllustrationPicker } from '@/features/boxes/components/BoxIllustrationPicker';
import { boxFormSchema, type BoxFormValues } from '@/features/boxes/components/boxFormSchema';
import {
  BOX_KIND_LABELS,
  BOX_KINDS,
  type Box,
  type BoxInput,
} from '@/features/boxes/models/box.model';

interface BoxFormDialogProps {
  open: boolean;
  box?: Box;
  onClose: () => void;
  onCreated?: (box: Box) => void;
}

export function BoxFormDialog({ open, box, onClose, onCreated }: BoxFormDialogProps) {
  const isEdit = !!box;
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateBox();
  const updateMutation = useUpdateBox();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BoxFormValues>({
    resolver: zodResolver(boxFormSchema),
    defaultValues: {
      name: '',
      kind: 'custom',
      illustration_key: 'piggy',
      target_amount: '',
      initial_balance: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: box?.name ?? '',
      kind: box?.kind ?? 'custom',
      illustration_key: box?.illustration_key ?? 'piggy',
      target_amount: formatAmountForInput(box?.target_amount),
      initial_balance: '',
      notes: box?.notes ?? '',
    });
  }, [open, box, reset]);

  const onSubmit = async (values: BoxFormValues) => {
    try {
      const target = parseAmountInput(values.target_amount ?? '');
      const illustration = getBoxIllustration(values.illustration_key);
      const input: BoxInput = {
        name: values.name.trim(),
        kind: values.kind,
        illustration_key: values.illustration_key,
        color: illustration.color,
        target_amount: target && target > 0 ? target : null,
        notes: values.notes?.trim() || undefined,
      };

      if (isEdit && box) {
        await updateMutation.mutateAsync({ id: box.id, input });
        showSuccess('Caixinha atualizada');
      } else {
        const initial = parseAmountInput(values.initial_balance ?? '');
        const created = await createMutation.mutateAsync({
          ...input,
          initial_balance: initial && initial > 0 ? initial : undefined,
        });
        showSuccess('Caixinha criada');
        onCreated?.(created);
      }
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(err as AxiosError<ErrorResponse>);
      showError(mapped.data.message ?? 'Erro ao salvar caixinha');
    }
  };

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Editar caixinha' : 'Nova caixinha'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      maxWidth="sm"
    >
      <Stack spacing={2.5}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Escolha uma ilustração</Typography>
          <Controller
            name="illustration_key"
            control={control}
            render={({ field }) => (
              <BoxIllustrationPicker
                value={field.value}
                onChange={(key) => {
                  field.onChange(key);
                  if (!isEdit && !getValues('name')) {
                    setValue('kind', getBoxIllustration(key).suggestedKind);
                  }
                }}
              />
            )}
          />
        </Stack>
        <TextField
          label="Nome"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />
        <Controller
          name="kind"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Tipo"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!errors.kind}
              helperText={errors.kind?.message}
              fullWidth
            >
              {BOX_KINDS.map((kind) => (
                <MenuItem key={kind} value={kind}>
                  {BOX_KIND_LABELS[kind]}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="target_amount"
          control={control}
          render={({ field }) => (
            <MoneyField
              label="Meta (opcional)"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!errors.target_amount}
              helperText={errors.target_amount?.message}
            />
          )}
        />
        {!isEdit && (
          <Controller
            name="initial_balance"
            control={control}
            render={({ field }) => (
              <MoneyField
                label="Saldo inicial (opcional)"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={!!errors.initial_balance}
                helperText={errors.initial_balance?.message}
              />
            )}
          />
        )}
        <TextField label="Notas" {...register('notes')} fullWidth multiline minRows={2} />
      </Stack>
    </FormDialog>
  );
}
