'use client';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import { EmailField } from '@/components/common/EmailField';
import { AuthBrandPanel } from '@/features/auth/components/AuthBrandPanel';
import { requiredEmailSchema } from '@/utils/maskedInput';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type { AppErrorResult } from '@/infrastructure/AppResponse';
import {
  disableBiometricLogin,
  enableBiometricLogin,
  isBiometricAvailable,
  isBiometricEnabled,
  loginWithBiometric,
} from '@/features/auth/services/biometric.service';

const REMEMBER_EMAIL_KEY = 'findu.login.rememberEmail';

const emailSchema = z.object({
  email: requiredEmailSchema,
});

const passwordSchema = z.object({
  password: z.string().min(1, 'Senha obrigatória'),
});

type EmailValues = z.infer<typeof emailSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;
type LoginStep = 'email' | 'password';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useLogin();
  const { showError, showSuccess } = useSnackbar();
  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioEnabled, setBioEnabled] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [enableDialogOpen, setEnableDialogOpen] = useState(false);
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  useEffect(() => {
    void (async () => {
      const available = await isBiometricAvailable();
      setBioAvailable(available);
      setBioEnabled(available && isBiometricEnabled());
    })();

    try {
      const saved = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (saved) {
        emailForm.setValue('email', saved);
        setRemember(true);
      }
    } catch {
      /* ignore */
    }
  }, [emailForm]);

  const finishLogin = () => {
    showSuccess('Login realizado com sucesso');
    const next = new URLSearchParams(window.location.search).get('next');
    router.replace(AppRoutePaths.safeNext(next));
  };

  const handleEmailContinue = emailForm.handleSubmit((data) => {
    setEmail(data.email.trim());
    if (remember) {
      try {
        localStorage.setItem(REMEMBER_EMAIL_KEY, data.email.trim());
      } catch {
        /* ignore */
      }
    } else {
      try {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      } catch {
        /* ignore */
      }
    }
    setStep('password');
  });

  const handlePasswordContinue = passwordForm.handleSubmit(async (data) => {
    try {
      await login({ email, password: data.password }).unwrap();

      if (bioAvailable && !isBiometricEnabled()) {
        setPendingPassword(data.password);
        setEnableDialogOpen(true);
        return;
      }

      if (bioAvailable) {
        try {
          await enableBiometricLogin(email, data.password);
        } catch {
          /* ignore */
        }
      }

      finishLogin();
    } catch (err) {
      const message =
        (err as AppErrorResult)?.data?.message ?? 'Erro ao fazer login';
      showError(message);
    }
  });

  const handleEnableBiometric = async () => {
    if (!pendingPassword) return;
    try {
      await enableBiometricLogin(email, pendingPassword);
      showSuccess('Digital ativada');
    } catch {
      showError('Não foi possível ativar a digital');
    } finally {
      setEnableDialogOpen(false);
      setPendingPassword(null);
      finishLogin();
    }
  };

  const handleSkipBiometric = () => {
    setEnableDialogOpen(false);
    setPendingPassword(null);
    finishLogin();
  };

  const handleBiometricLogin = async () => {
    setBioLoading(true);
    try {
      const result = await loginWithBiometric();

      switch (result.status) {
        case 'cancelled':
          return;
        case 'unavailable':
          setBioEnabled(false);
          showError('Biometria indisponível neste aparelho. Entre com sua senha.');
          return;
        case 'not_enrolled':
          setBioEnabled(false);
          showError('Digital desativada. Entre com sua senha para ativar novamente.');
          return;
        case 'success':
          break;
        default: {
          const exhaustive: never = result;
          return exhaustive;
        }
      }

      try {
        await login(result.credentials).unwrap();
      } catch (err) {
        if ((err as AppErrorResult)?.httpStatusCode === 401) {
          await disableBiometricLogin();
          setBioEnabled(false);
          showError('Suas credenciais mudaram. Entre com a senha para reativar a digital.');
          return;
        }
        throw err;
      }

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

  const handleBack = () => {
    if (step === 'password') {
      setStep('email');
      passwordForm.reset({ password: '' });
      return;
    }
    router.push(AppRoutePaths.ROOT);
  };

  const emailValue = emailForm.watch('email');
  const passwordValue = passwordForm.watch('password');
  const canContinueEmail = requiredEmailSchema.safeParse(emailValue ?? '').success;
  const canContinuePassword = !!passwordValue?.trim();

  return (
    <>
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          bgcolor: '#0B1220',
          color: '#fff',
        }}
      >
        <AuthBrandPanel />
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '0 0 520px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { xs: 'flex-start', md: 'center' },
            minHeight: '100dvh',
            px: { xs: 2.5, md: 6 },
            pt: { xs: 'calc(0.75rem + var(--app-safe-top, 0px))', md: 6 },
            pb: { xs: 'calc(1.5rem + var(--app-safe-bottom, 0px))', md: 6 },
            background: {
              xs: 'radial-gradient(120% 70% at 50% -10%, rgba(47,111,224,0.28) 0%, transparent 55%), linear-gradient(180deg, #102A52 0%, #0B1220 42%, #070B14 100%)',
              md: '#0B1220',
            },
          }}
        >
        <Box
          sx={{
            display: { xs: 'grid', md: 'none' },
            gridTemplateColumns: '40px 1fr 40px',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <IconButton
            onClick={handleBack}
            aria-label="Voltar"
            sx={{ color: '#fff', justifySelf: 'start' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              textAlign: 'center',
              fontWeight: 600,
              fontSize: 17,
              letterSpacing: '-0.01em',
            }}
          >
            Entrar
          </Typography>
          <Box />
        </Box>

        <Box
          key={step}
          className="findu-anim-tab-enter"
          sx={{
            flex: { xs: 1, md: '0 0 auto' },
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 440,
            width: '100%',
            mx: 'auto',
          }}
        >
          {step === 'email' ? (
            <Box
              component="form"
              onSubmit={handleEmailContinue}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', flex: { xs: 1, md: '0 0 auto' } }}
            >
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.85rem', sm: '2.1rem' },
                  letterSpacing: '-0.035em',
                  lineHeight: 1.15,
                  mb: 3.5,
                }}
              >
                Digite seu e-mail
              </Typography>

              <Controller
                name="email"
                control={emailForm.control}
                render={({ field, fieldState }) => (
                  <EmailField
                    label="Seu e-mail"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    autoFocus
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={fieldSx}
                  />
                )}
              />

              <FormControlLabel
                sx={{ mt: 2, ml: -0.5, color: 'rgba(255,255,255,0.88)' }}
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(_, checked) => setRemember(checked)}
                    sx={{
                      color: 'rgba(255,255,255,0.45)',
                      '&.Mui-checked': { color: 'primary.main' },
                    }}
                  />
                }
                label="Lembrar meu e-mail"
              />

              {bioEnabled && (
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<FingerprintIcon />}
                  disabled={isLoading || bioLoading}
                  onClick={() => void handleBiometricLogin()}
                  sx={{
                    mt: 2,
                    borderRadius: 999,
                    py: 1.35,
                    textTransform: 'none',
                    fontWeight: 700,
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.35)',
                  }}
                >
                  {bioLoading ? 'Validando…' : 'Entrar com digital'}
                </Button>
              )}

              <Box sx={{ flex: 1, display: { md: 'none' } }} />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!canContinueEmail}
                sx={continueBtnSx}
              >
                Continuar
              </Button>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}
              >
                Não tem conta?{' '}
                <Link
                  component={NextLink}
                  href={AppRoutePaths.REGISTER}
                  sx={{ color: '#fff', fontWeight: 700 }}
                >
                  Cadastre-se
                </Link>
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handlePasswordContinue}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', flex: { xs: 1, md: '0 0 auto' } }}
            >
              <Button
                type="button"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  alignSelf: 'flex-start',
                  mb: 2,
                  px: 0,
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                }}
              >
                Trocar e-mail
              </Button>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.85rem', sm: '2.1rem' },
                  letterSpacing: '-0.035em',
                  lineHeight: 1.15,
                  mb: 1,
                }}
              >
                Digite sua senha
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.65)',
                  mb: 3.5,
                  fontSize: 14,
                }}
              >
                {email}
              </Typography>

              <TextField
                label="Sua senha"
                placeholder="Digite sua senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                autoFocus
                fullWidth
                {...passwordForm.register('password')}
                error={!!passwordForm.formState.errors.password}
                helperText={passwordForm.formState.errors.password?.message}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />

              <Box sx={{ flex: 1, display: { md: 'none' } }} />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!canContinuePassword || isLoading || bioLoading}
                sx={continueBtnSx}
              >
                {isLoading ? 'Entrando…' : 'Continuar'}
              </Button>

              <Typography align="center" sx={{ mt: 2 }}>
                <Link
                  component={NextLink}
                  href={AppRoutePaths.FORGOT_PASSWORD}
                  sx={{
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  Esqueci minha senha
                </Link>
              </Typography>
            </Box>
          )}
        </Box>
        </Box>
      </Box>

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

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: 2,
    '& fieldset': { borderColor: 'rgba(255,255,255,0.35)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.55)' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'primary.light' },
  '& .MuiFormHelperText-root': { color: 'error.light' },
  '& input::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
} as const;

const continueBtnSx = {
  mt: 1,
  py: 1.5,
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: 16,
  bgcolor: 'primary.main',
  '&.Mui-disabled': {
    bgcolor: 'rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.35)',
  },
} as const;
