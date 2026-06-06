'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

export function DashboardWelcome() {
  const { user } = useCurrentUser();

  return (
    <Paper className="rounded-2xl px-6 py-8 md:px-10 md:py-10">
      <Stack spacing={1.5}>
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
      </Stack>
    </Paper>
  );
}
