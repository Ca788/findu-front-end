'use client';

import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/AddOutlined';
import { AxiosError } from 'axios';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataPagination } from '@/components/common/DataPagination';
import { PageHeader } from '@/components/common/PageHeader';
import { RowActions } from '@/components/common/RowActions';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { formatBRL } from '@/utils/currency';
import { formatDateBR } from '@/utils/date';
import {
  useDeleteInvestment,
  useInvestmentDialogs,
  useInvestments,
} from '@/features/investments/hooks/useInvestments';
import { InvestmentFormDialog } from '@/features/investments/components/InvestmentFormDialog';
import {
  INVESTMENT_ASSET_LABELS,
  INVESTMENT_STATUS_LABELS,
  type Investment,
} from '@/features/investments/models/investment.model';

export function InvestmentsPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const dialogs = useInvestmentDialogs();
  const { showSuccess, showError } = useSnackbar();
  const { mutateAsync: remove, isPending: isDeleting } = useDeleteInvestment();
  const { data, isLoading, isFetching, isError } = useInvestments({ page, perPage });

  const investments = data?.data ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;

  const handleDelete = async () => {
    if (!dialogs.selected) return;
    try {
      await remove(dialogs.selected.id);
      showSuccess('Investimento removido');
      dialogs.close();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao remover investimento');
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Financeiro"
        title="Investimentos"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={dialogs.openCreate}
            className="w-full sm:w-auto"
          >
            Novo investimento
          </Button>
        }
      />

      {isError && <Alert severity="error">Erro ao carregar investimentos.</Alert>}
      {isFetching && <LinearProgress />}

      {!isLoading && investments.length === 0 ? (
        <Paper className="rounded-2xl px-4 py-10 text-center">
          <Typography variant="body2" color="text.secondary">
            Nenhum investimento cadastrado.
          </Typography>
        </Paper>
      ) : (
        <div className="flex flex-col gap-2">
          {investments.map((item) => (
            <InvestmentCard
              key={item.id}
              investment={item}
              onEdit={dialogs.openEdit}
              onDelete={dialogs.openDelete}
            />
          ))}
        </div>
      )}

      {totalCount > 0 && (
        <DataPagination
          page={page}
          perPage={perPage}
          totalCount={totalCount}
          onPageChange={setPage}
          onPerPageChange={(next) => {
            setPerPage(next);
            setPage(1);
          }}
        />
      )}

      <InvestmentFormDialog
        open={dialogs.isFormOpen}
        investment={dialogs.selected}
        onClose={dialogs.close}
      />
      <ConfirmDialog
        open={dialogs.isDeleteOpen}
        title="Remover investimento"
        description={
          <>
            Tem certeza que deseja remover{' '}
            <strong>{dialogs.selected?.name ?? ''}</strong>?
          </>
        }
        confirmLabel="Remover"
        confirmColor="error"
        isLoading={isDeleting}
        onClose={dialogs.close}
        onConfirm={() => void handleDelete()}
      />
    </Stack>
  );
}

function InvestmentCard({
  investment,
  onEdit,
  onDelete,
}: {
  investment: Investment;
  onEdit: (investment: Investment) => void;
  onDelete: (investment: Investment) => void;
}) {
  const ret = Number(investment.return_percent ?? 0);
  const positive = ret >= 0;

  return (
    <Paper className="flex flex-col gap-2 rounded-2xl px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Typography variant="body1" className="font-medium" noWrap>
            {investment.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {INVESTMENT_ASSET_LABELS[investment.asset_type]}
            {investment.institution ? ` · ${investment.institution}` : ''}
          </Typography>
        </div>
        <RowActions
          onEdit={() => onEdit(investment)}
          onDelete={() => onDelete(investment)}
        />
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <Typography variant="caption" color="text.secondary">
            Atual
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {formatBRL(investment.current_amount)}
          </Typography>
        </div>
        <div className="text-right">
          <Typography
            variant="caption"
            sx={{ color: positive ? 'success.main' : 'error.main', fontWeight: 600 }}
          >
            {positive ? '+' : ''}
            {ret.toFixed(2)}%
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {INVESTMENT_STATUS_LABELS[investment.status]} ·{' '}
            {formatDateBR(investment.invested_on)}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}
