'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { formatBRL } from '@/utils/currency';
import { formatMonthLabel } from '@/features/statements/utils/month';
import {
  useCancelInstallmentPlan,
  useInstallmentPlans,
} from '@/features/installments/hooks/useInstallmentPlans';
import { InstallmentFormDialog } from '@/features/installments/components/InstallmentFormDialog';
import type { InstallmentPlan } from '@/features/installments/models/installment.model';

function statusColor(status: InstallmentPlan['status']): 'primary' | 'success' | 'default' {
  switch (status) {
    case 'active':
      return 'primary';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
}

function statusLabel(status: InstallmentPlan['status']): string {
  switch (status) {
    case 'active':
      return 'Ativo';
    case 'completed':
      return 'Concluído';
    case 'canceled':
      return 'Cancelado';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function InstallmentsPage() {
  const { showSuccess, showError } = useSnackbar();
  const query = useInstallmentPlans({ page: 1, perPage: 50 });
  const cancelMutation = useCancelInstallmentPlan();
  const [isFormOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<InstallmentPlan | null>(null);
  const [canceling, setCanceling] = useState<InstallmentPlan | null>(null);

  const plans = query.data?.data ?? [];

  const handleCancel = async () => {
    if (!canceling) return;
    try {
      await cancelMutation.mutateAsync(canceling.id);
      showSuccess('Parcelamento cancelado');
      setCanceling(null);
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao cancelar parcelamento');
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Financeiro"
        title="Parcelamentos"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelected(null);
              setFormOpen(true);
            }}
          >
            Novo parcelamento
          </Button>
        }
      />

      {query.isError && <Alert severity="error">Erro ao carregar parcelamentos.</Alert>}
      {query.isFetching && <LinearProgress />}

      {!query.isFetching && plans.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Você ainda não cadastrou nenhum parcelamento. Cadastre uma vez (valor,
          quantidade, mês da 1ª parcela) e o sistema criará automaticamente todas
          as parcelas nos meses seguintes.
        </Typography>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((plan) => {
          const paidPercent =
            plan.total_installments > 0
              ? Math.round((plan.paid_count / plan.total_installments) * 100)
              : 0;

          return (
            <Paper key={plan.id} className="flex flex-col gap-2 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Typography variant="subtitle1" className="truncate">
                    {plan.description || 'Parcelamento'}
                  </Typography>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    <Chip
                      size="small"
                      color={statusColor(plan.status)}
                      variant="outlined"
                      label={statusLabel(plan.status)}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelected(plan);
                      setFormOpen(true);
                    }}
                    aria-label="Editar"
                    disabled={plan.status !== 'active'}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setCanceling(plan)}
                    aria-label="Cancelar"
                    disabled={plan.status !== 'active'}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>

              <Typography
                variant="h6"
                sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
              >
                {formatBRL(plan.monthly_amount)}
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  × {plan.total_installments}
                </Typography>
              </Typography>

              <div>
                <LinearProgress
                  variant="determinate"
                  value={paidPercent}
                  className="h-2 rounded"
                />
                <Typography variant="caption" color="text.secondary">
                  {plan.paid_count}/{plan.total_installments} pagas · restam {formatBRL(plan.remaining_amount)}
                </Typography>
              </div>

              <Typography variant="caption" color="text.secondary">
                Início: {formatMonthLabel(plan.first_competency)}
                {plan.end_competency ? ` · fim previsto: ${formatMonthLabel(plan.end_competency)}` : ''}
              </Typography>
            </Paper>
          );
        })}
      </div>

      <InstallmentFormDialog
        open={isFormOpen}
        plan={selected}
        onClose={() => {
          setFormOpen(false);
          setSelected(null);
        }}
      />

      <ConfirmDialog
        open={!!canceling}
        title="Cancelar parcelamento"
        description={`Cancelar "${canceling?.description || 'este parcelamento'}"? As parcelas futuras pendentes serão removidas, mas o histórico já pago fica preservado.`}
        confirmColor="error"
        confirmLabel="Cancelar parcelamento"
        isLoading={cancelMutation.isPending}
        onClose={() => setCanceling(null)}
        onConfirm={handleCancel}
      />
    </Stack>
  );
}
