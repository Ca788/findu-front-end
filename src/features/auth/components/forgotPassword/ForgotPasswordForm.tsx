'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import NextLink from 'next/link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { EmailField } from '@/components/common/EmailField';
import { requiredEmailSchema } from '@/utils/maskedInput';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { requestPasswordReset } from '@/features/auth/gateway/auth.gateway';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';

const schema = z.object({
  email: requiredEmailSchema,
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await requestPasswordReset(data);
      showSuccess('Se o email existir, enviaremos instruções em instantes.');
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao solicitar redefinição');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <EmailField
              label="E-mail"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || !!errors.email}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
        </Button>
        <Typography variant="body2" color="text.secondary" align="center">
          Lembrou sua senha?{' '}
          <Link component={NextLink} href={AppRoutePaths.LOGIN}>
            Voltar ao login
          </Link>
        </Typography>
      </Stack>
    </form>
  );
}
