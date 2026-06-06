'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import NextLink from 'next/link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { resetPassword } from '@/features/auth/gateway/auth.gateway';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';

const schema = z
  .object({
    password: z.string().min(8, 'Mínimo de 8 caracteres'),
    passwordConfirmation: z.string().min(8, 'Mínimo de 8 caracteres'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Senhas não conferem',
  });

type FormValues = z.infer<typeof schema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', passwordConfirmation: '' },
  });

  if (!token) {
    return (
      <Alert severity="error">
        Token de redefinição ausente ou inválido.{' '}
        <Link component={NextLink} href={AppRoutePaths.FORGOT_PASSWORD}>
          Solicitar novo link
        </Link>
        .
      </Alert>
    );
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await resetPassword({
        resetPasswordToken: token,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      });
      showSuccess('Senha redefinida com sucesso. Faça login.');
      router.replace(AppRoutePaths.LOGIN);
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao redefinir senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <TextField
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          fullWidth
          {...register('passwordConfirmation')}
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
        </Button>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link component={NextLink} href={AppRoutePaths.LOGIN}>
            Voltar ao login
          </Link>
        </Typography>
      </Stack>
    </form>
  );
}
