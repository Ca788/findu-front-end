'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useDevice } from '@/hooks/useDevice';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { formatBRL } from '@/utils/currency';
import { formatDateBR } from '@/utils/date';
import {
  useCancelRecurrence,
  useRecurrences,
} from '@/features/recurrences/hooks/useRecurrences';
import { RecurrenceFormDialog } from '@/features/recurrences/components/RecurrenceFormDialog';
import type { RecurrenceRule } from '@/features/recurrences/models/recurrence.model';

export function RecurrencesPage() {
  const { isMobile } = useDevice();
  const { showSuccess, showError } = useSnackbar();
  const query = useRecurrences({ page: 1, perPage: 50 });
  const cancelMutation = useCancelRecurrence();
  const [isFormOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<RecurrenceRule | null>(null);
  const [canceling, setCanceling] = useState<RecurrenceRule | null>(null);

  const rules = query.data?.data ?? [];

  const openCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const handleCancel = async () => {
    if (!canceling) return;
    try {
      await cancelMutation.mutateAsync(canceling.id);
      showSuccess('Recorrência cancelada');
      setCanceling(null);
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao cancelar recorrência');
    }
  };

  return (
    <Stack spacing={{ xs: 2, sm: 3 }} className="pb-20 sm:pb-0">
      <PageHeader
        eyebrow="Financeiro"
        title="Recorrências"
        actions={
          !isMobile ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Nova recorrência
            </Button>
          ) : undefined
        }
      />

      {query.isError && <Alert severity="error">Erro ao carregar recorrências.</Alert>}
      {query.isFetching && <LinearProgress />}

      {!query.isFetching && rules.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Você ainda não cadastrou nenhuma recorrência. Cadastre coisas como aluguel,
          internet, academia ou salário — o sistema criará automaticamente os
          lançamentos dos próximos meses.
        </Typography>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {rules.map((rule) => (
          <Paper key={rule.id} className="flex flex-col gap-2 rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Typography variant="subtitle1" className="break-words">
                  {rule.description || 'Recorrência'}
                </Typography>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <Chip
                    size="small"
                    variant="outlined"
                    color={rule.transaction_type === 'income' ? 'success' : 'error'}
                    label={rule.transaction_type === 'income' ? 'Receita' : 'Despesa'}
                  />
                  {!rule.active && (
                    <Chip size="small" variant="outlined" label="Inativa" />
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelected(rule);
                    setFormOpen(true);
                  }}
                  aria-label="Editar"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setCanceling(rule)}
                  aria-label="Cancelar"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </div>

            <Typography
              variant="h6"
              sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
            >
              {formatBRL(rule.amount)}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {rule.day_of_month ? `Dia ${rule.day_of_month} · ` : ''}
              Desde {formatDateBR(rule.starts_on)}
              {rule.ends_on ? ` até ${formatDateBR(rule.ends_on)}` : ' · sem prazo'}
            </Typography>
          </Paper>
        ))}
      </div>

      <RecurrenceFormDialog
        open={isFormOpen}
        rule={selected}
        onClose={() => {
          setFormOpen(false);
          setSelected(null);
        }}
      />

      <ConfirmDialog
        open={!!canceling}
        title="Cancelar recorrência"
        description={`Cancelar "${canceling?.description || 'esta recorrência'}"? Os lançamentos futuros pendentes serão removidos, mas o histórico já pago fica preservado.`}
        confirmColor="error"
        confirmLabel="Cancelar recorrência"
        isLoading={cancelMutation.isPending}
        onClose={() => setCanceling(null)}
        onConfirm={handleCancel}
      />

      {isMobile && (
        <Fab
          color="primary"
          aria-label="Nova recorrência"
          onClick={openCreate}
          sx={{
            position: 'fixed',
            right: 16,
            bottom: 'max(16px, env(safe-area-inset-bottom))',
            zIndex: (theme) => theme.zIndex.speedDial,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Stack>
  );
}
