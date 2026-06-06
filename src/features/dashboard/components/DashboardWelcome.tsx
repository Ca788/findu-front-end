'use client';

import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export function DashboardWelcome() {
  const { user } = useCurrentUser();
  const { logout, isLoading } = useLogout();
  const { showSuccess, showError } = useSnackbar();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      showSuccess('Sessão encerrada');
    } catch {
      showError('Erro ao encerrar sessão');
    } finally {
      router.replace(AppRoutePaths.LOGIN);
    }
  };

  return (
    <Paper className="rounded-2xl px-6 py-8 md:px-10 md:py-10">
      <Stack spacing={3}>
        <div className="flex flex-col gap-1.5">
          <Typography variant="overline" color="text.secondary">
            Dashboard
          </Typography>
          <Typography variant="h4" component="h1">
            Olá, {user?.name ?? 'usuário'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Em breve você verá aqui o resumo financeiro do mês, orçamentos e
            últimas transações.
          </Typography>
        </div>
        <Button
          variant="outlined"
          onClick={handleLogout}
          disabled={isLoading}
          className="self-start"
        >
          {isLoading ? 'Saindo...' : 'Sair'}
        </Button>
      </Stack>
    </Paper>
  );
}
