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
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import SendIcon from '@mui/icons-material/SendOutlined';
import { PageHeader } from '@/components/common/PageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { useDevice } from '@/hooks/useDevice';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { formatBRL } from '@/utils/currency';
import { formatDateBR, formatDateTimeBR } from '@/utils/date';
import { useReceipts } from '@/features/receipts/hooks/useReceipts';
import {
  useDeliverReceipt,
  useDownloadReceipt,
} from '@/features/receipts/hooks/useReceiptMutations';
import { ReceiptFormDialog } from '@/features/receipts/components/ReceiptFormDialog';
import {
  RECEIPT_STATUS_LABELS,
  type Receipt,
  type ReceiptStatus,
} from '@/features/receipts/models/receipt.model';

function statusColor(status: ReceiptStatus): 'default' | 'success' | 'error' {
  switch (status) {
    case 'sent':
      return 'success';
    case 'failed':
      return 'error';
    case 'pending':
      return 'default';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function ReceiptCard({
  receipt,
  onDownload,
  onDeliver,
  busy,
}: {
  receipt: Receipt;
  onDownload: (receipt: Receipt) => void;
  onDeliver: (receipt: Receipt) => void;
  busy: boolean;
}) {
  return (
    <Paper className="flex flex-col gap-2 rounded-2xl p-3.5 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Typography variant="subtitle1" className="break-words">
            {receipt.payer_name || receipt.payer_phone}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {receipt.payer_name ? receipt.payer_phone : null}
          </Typography>
        </div>
        <Chip
          size="small"
          variant="outlined"
          color={statusColor(receipt.status)}
          label={RECEIPT_STATUS_LABELS[receipt.status]}
        />
      </div>

      <Typography variant="h6" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
        {formatBRL(receipt.total_amount)}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        {formatDateBR(receipt.period_start)} até {formatDateBR(receipt.period_end)}
        {receipt.sent_at ? ` · enviado ${formatDateTimeBR(receipt.sent_at)}` : ''}
      </Typography>

      <div className="flex justify-end gap-1">
        <IconButton
          size="small"
          aria-label="Baixar PDF"
          disabled={busy}
          onClick={() => onDownload(receipt)}
        >
          <DownloadIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Enviar no WhatsApp"
          disabled={busy}
          onClick={() => onDeliver(receipt)}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </div>
    </Paper>
  );
}

export function ReceiptsPage() {
  const { isMobile } = useDevice();
  const { showSuccess, showError } = useSnackbar();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isFormOpen, setFormOpen] = useState(false);

  const query = useReceipts({ page, perPage, view: 'default' });
  const deliverMutation = useDeliverReceipt();
  const downloadMutation = useDownloadReceipt();

  const receipts = query.data?.data ?? [];
  const totalCount = query.data?.pagination.totalCount ?? 0;
  const busy = deliverMutation.isPending || downloadMutation.isPending;

  const handleDownload = async (receipt: Receipt) => {
    try {
      await downloadMutation.mutateAsync({
        id: receipt.id,
        filename: receipt.filename ?? `comprovante-${receipt.id}.pdf`,
      });
      showSuccess('Download iniciado');
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao baixar comprovante');
    }
  };

  const handleDeliver = async (receipt: Receipt) => {
    try {
      await deliverMutation.mutateAsync(receipt.id);
      showSuccess('Comprovante enfileirado no WhatsApp');
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao enviar comprovante');
    }
  };

  return (
    <Stack spacing={{ xs: 2, sm: 3 }} className="pb-20 sm:pb-0">
      <PageHeader
        eyebrow="Financeiro"
        title="Comprovantes"
        actions={
          !isMobile ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
            >
              Novo comprovante
            </Button>
          ) : undefined
        }
      />

      {query.isError && <Alert severity="error">Erro ao carregar comprovantes.</Alert>}
      {query.isFetching && <LinearProgress />}

      {!query.isFetching && receipts.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Gere um PDF por pagador e, se quiser, envie no WhatsApp. O pagador precisa
          estar no lançamento.
        </Typography>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {receipts.map((receipt) => (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            busy={busy}
            onDownload={handleDownload}
            onDeliver={handleDeliver}
          />
        ))}
      </div>

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

      <ReceiptFormDialog open={isFormOpen} onClose={() => setFormOpen(false)} />

      {isMobile && (
        <Fab
          color="primary"
          aria-label="Novo comprovante"
          onClick={() => setFormOpen(true)}
          sx={{
            position: 'fixed',
            right: 16,
            bottom: 'calc(var(--app-bottom-nav-space, 80px) + 8px)',
            zIndex: (theme) => theme.zIndex.speedDial,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Stack>
  );
}
