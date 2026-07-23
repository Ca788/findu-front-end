'use client';

import Link from 'next/link';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useInstallmentPlans } from '@/features/installments/hooks/useInstallmentPlans';
import {
  endingInstallmentMessage,
  selectEndingInstallments,
} from '@/features/installments/utils/endingInstallments';

export function DashboardEndingInstallments() {
  const query = useInstallmentPlans({ page: 1, perPage: 50 });
  const ending = selectEndingInstallments(query.data?.data ?? []);

  if (query.isError || ending.length === 0) return null;

  return (
    <Alert
      severity="info"
      sx={{
        borderRadius: '12px',
        alignItems: 'flex-start',
        '& .MuiAlert-message': { width: '100%' },
      }}
      action={
        <Button
          component={Link}
          href={AppRoutePaths.INSTALLMENTS}
          color="inherit"
          size="small"
          sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
        >
          Ver parcelas
        </Button>
      }
    >
      <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>
        Parcelas perto do fim
      </AlertTitle>
      <Stack spacing={0.35}>
        {ending.slice(0, 3).map((plan) => (
          <Typography key={plan.id} variant="body2">
            {endingInstallmentMessage(plan)}
          </Typography>
        ))}
        {ending.length > 3 ? (
          <Typography variant="caption" color="text.secondary">
            +{ending.length - 3} outros parcelamentos
          </Typography>
        ) : null}
      </Stack>
    </Alert>
  );
}
