'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type { AppErrorResult } from '@/infrastructure/AppResponse';
import {
  enableBiometricLogin,
  isBiometricAvailable,
  isBiometricEnabled,
  loginWithBiometric,
} from '@/features/auth/services/biometric.service';

const loginSchema = z.object({
  email: z.email('Email inválido').min(1, 'Email obrigatório'),
  password: z.string().min(1, 'Senha obrigatória'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useLogin();
  const { showError, showSuccess } = useSnackbar();
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [enableDialogOpen, setEnableDialogOpen] = useState(false);
  const [pendingCredentials, setPendingCredentials] =
    useState<LoginFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    void (async () => {
      const available = await isBiometricAvailable();
      setBioAvailable(available);
      setBioEnabled(available && isBiometricEnabled());
    })();
  }, []);

  const finishLogin = () => {
    showSuccess('Login realizado com sucesso');
    router.replace(AppRoutePaths.CHAT);
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data).unwrap();
      if (bioAvailable && !isBiometricEnabled()) {
        setPendingCredentials(data);
        setEnableDialogOpen(true);
        return;
      }
      finishLogin();
    } catch (err) {
      const message =
        (err as AppErrorResult)?.data?.message ?? 'Erro ao fazer login';
      showError(message);
    }
  };

  const handleEnableBiometric = async () => {
    if (!pendingCredentials) return;
    try {
      await enableBiometricLogin(
        pendingCredentials.email,
        pendingCredentials.password,
      );
      showSuccess('Digital ativada');
    } catch {
      showError('Não foi possível ativar a digital');
    } finally {
      setEnableDialogOpen(false);
      setPendingCredentials(null);
      finishLogin();
    }
  };

  const handleSkipBiometric = () => {
    setEnableDialogOpen(false);
    setPendingCredentials(null);
    finishLogin();
  };

  const handleBiometricLogin = async () => {
    setBioLoading(true);
    try {
      const credentials = await loginWithBiometric();
      if (!credentials) {
        showError('Digital não configurada');
        return;
      }
      await login(credentials).unwrap();
      finishLogin();
    } catch (err) {
      const message =
        (err as AppErrorResult)?.data?.message ??
        'Não foi possível entrar com a digital';
      showError(message);
    } finally {
      setBioLoading(false);
    }
  };

  return (
    <>
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
            disabled={isLoading || bioLoading}
            fullWidth
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          {bioEnabled && (
            <Button
              type="button"
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<FingerprintIcon />}
              disabled={isLoading || bioLoading}
              onClick={() => void handleBiometricLogin()}
            >
              {bioLoading ? 'Validando…' : 'Entrar com digital'}
            </Button>
          )}

          <Typography variant="body2" color="text.secondary" align="center">
            <Link component={NextLink} href={AppRoutePaths.FORGOT_PASSWORD}>
              Esqueci minha senha
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Não tem conta?{' '}
            <Link component={NextLink} href={AppRoutePaths.REGISTER}>
              Criar agora
            </Link>
          </Typography>
        </Stack>
      </form>

      <Dialog open={enableDialogOpen} onClose={handleSkipBiometric}>
        <DialogTitle>Usar digital?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Na próxima vez você poderá entrar no Findu com a digital do celular.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSkipBiometric}>Agora não</Button>
          <Button variant="contained" onClick={() => void handleEnableBiometric()}>
            Ativar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
