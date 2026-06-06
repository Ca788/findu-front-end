'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import NextLink from 'next/link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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
  email: z.email('Email inválido').min(1, 'Email obrigatório'),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
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
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
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
