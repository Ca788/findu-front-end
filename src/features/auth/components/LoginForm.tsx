'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type { AppErrorResult } from '@/infrastructure/AppResponse';

const loginSchema = z.object({
  email: z.email('Email inválido').min(1, 'Email obrigatório'),
  password: z.string().min(1, 'Senha obrigatória'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useLogin();
  const { showError, showSuccess } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data).unwrap();
      showSuccess('Login realizado com sucesso');
      router.replace(AppRoutePaths.DASHBOARD);
    } catch (err) {
      const message =
        (err as AppErrorResult)?.data?.message ?? 'Erro ao fazer login';
      showError(message);
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
        <TextField
          label="Senha"
          type="password"
          autoComplete="current-password"
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
        <Typography variant="body2" color="text.secondary" align="center">
          Não tem conta?{' '}
          <Link component={NextLink} href={AppRoutePaths.REGISTER}>
            Criar agora
          </Link>
        </Typography>
      </Stack>
    </form>
  );
}
