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
import { useRegister } from '@/features/auth/hooks/useRegister';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type { AppErrorResult } from '@/infrastructure/AppResponse';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Nome obrigatório').min(2, 'Nome muito curto'),
    email: z.email('Email inválido').min(1, 'Email obrigatório'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
    passwordConfirmation: z.string().min(1, 'Confirme a senha'),
  })
  .refine((d) => d.password === d.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Senhas não conferem',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useRegister();
  const { showError, showSuccess } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const phone = data.phone?.trim();
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
      ...(phone ? { phone } : {}),
    };

    try {
      await registerUser(payload).unwrap();
      showSuccess('Conta criada com sucesso');
      router.replace(AppRoutePaths.CHAT);
    } catch (err) {
      const message =
        (err as AppErrorResult)?.data?.message ?? 'Erro ao criar conta';
      showError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <TextField
          label="Nome"
          autoComplete="name"
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
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
          label="Telefone (opcional)"
          type="tel"
          autoComplete="tel"
          fullWidth
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete="new-password"
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="Confirmar senha"
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
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </Button>
        <Typography variant="body2" color="text.secondary" align="center">
          Já tem conta?{' '}
          <Link component={NextLink} href={AppRoutePaths.LOGIN}>
            Entrar
          </Link>
        </Typography>
      </Stack>
    </form>
  );
}
