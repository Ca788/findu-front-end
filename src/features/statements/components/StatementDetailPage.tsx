'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/AddOutlined';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useDevice } from '@/hooks/useDevice';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useStatement } from '@/features/statements/hooks/useStatement';
import {
  useDeleteEntry,
  useMarkEntryPaid,
  useMarkEntryPending,
} from '@/features/statements/hooks/useEntryMutations';
import { EntryRow } from '@/features/statements/components/EntryRow';
import { EntryFormDialog } from '@/features/statements/components/EntryFormDialog';
import { StatementEntriesFilters } from '@/features/statements/components/StatementEntriesFilters';
import { StatementKpis } from '@/features/statements/components/StatementKpis';
import { StatementMonthSwitcher } from '@/features/statements/components/StatementMonthSwitcher';
import { StatementSideLists } from '@/features/statements/components/StatementSideLists';
import {
  DEFAULT_ENTRY_FILTERS,
  filterStatementEntries,
  type StatementEntryFilters,
} from '@/features/statements/models/entryFilters.model';
import type { Transaction } from '@/features/transactions/models/transaction.model';

interface StatementDetailPageProps {
  month: string;
}

export function StatementDetailPage({ month }: StatementDetailPageProps) {
  const router = useRouter();
  const { isMobile } = useDevice();
  const { showSuccess, showError } = useSnackbar();
  const query = useStatement(month);
  const markPaid = useMarkEntryPaid(month);
  const markPending = useMarkEntryPending(month);
  const deleteEntry = useDeleteEntry(month);

  const [isFormOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<StatementEntryFilters>(DEFAULT_ENTRY_FILTERS);

  const statement = query.data;

  useEffect(() => {
    setFilters(DEFAULT_ENTRY_FILTERS);
  }, [month]);

  const goToMonth = (nextMonth: string) => {
    router.push(AppRoutePaths.statementDetail(nextMonth));
  };

  const openCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (entry: Transaction) => {
    setSelected(entry);
    setFormOpen(true);
  };

  const handleToggle = async (entry: Transaction) => {
    try {
      if (entry.status === 'paid') {
        await markPending.mutateAsync(entry.id);
      } else {
        await markPaid.mutateAsync({ id: entry.id });
      }
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao atualizar status');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteEntry.mutateAsync(deleting.id);
      showSuccess('Lançamento removido');
      setDeleting(null);
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao remover lançamento');
    }
  };

  const entries = statement?.entries ?? [];
  const filteredEntries = useMemo(
    () => filterStatementEntries(entries, filters),
    [entries, filters],
  );
  const pendingEntries = filteredEntries.filter((entry) => entry.status === 'pending');
  const paidEntries = filteredEntries.filter((entry) => entry.status === 'paid');

  return (
    <Stack spacing={{ xs: 2, sm: 3 }} className="pb-20 sm:pb-0">
      <PageHeader
        eyebrow="Extrato"
        title="Planejamento do mês"
        actions={
          <>
            <StatementMonthSwitcher month={month} onChange={goToMonth} />
            {!isMobile && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreate}
              >
                Novo lançamento
              </Button>
            )}
          </>
        }
      />

      {query.isError && <Alert severity="error">Erro ao carregar o extrato.</Alert>}
      {query.isFetching && <LinearProgress />}

      <StatementKpis statement={statement} />

      <div className="grid gap-3 lg:grid-cols-3">
        <Paper className="flex flex-col gap-2 rounded-2xl p-3 sm:p-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Typography variant="subtitle1">Lançamentos</Typography>
            <div className="flex flex-wrap items-center gap-1.5">
              <Chip size="small" label={`${pendingEntries.length} pend.`} />
              <Chip
                size="small"
                color="success"
                variant="outlined"
                label={`${paidEntries.length} pagos`}
              />
            </div>
          </div>

          <StatementEntriesFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filteredEntries.length}
            totalCount={entries.length}
          />

          {entries.length === 0 && !query.isLoading && (
            <Typography variant="body2" color="text.secondary">
              Nenhum lançamento neste mês. Clique em "Novo lançamento" para começar.
            </Typography>
          )}

          {entries.length > 0 && filteredEntries.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhum lançamento corresponde aos filtros.
            </Typography>
          )}

          {pendingEntries.length > 0 && (
            <div className="flex flex-col gap-2">
              <Typography variant="overline" color="text.secondary">Pendentes</Typography>
              {pendingEntries.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                  isToggling={markPaid.isPending || markPending.isPending}
                />
              ))}
            </div>
          )}

          {paidEntries.length > 0 && (
            <div className="flex flex-col gap-2">
              <Typography variant="overline" color="text.secondary">Pagos</Typography>
              {paidEntries.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                  isToggling={markPaid.isPending || markPending.isPending}
                />
              ))}
            </div>
          )}
        </Paper>

        <StatementSideLists statement={statement} />
      </div>

      <EntryFormDialog
        open={isFormOpen}
        month={month}
        entry={selected}
        onClose={() => {
          setFormOpen(false);
          setSelected(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Remover lançamento"
        description={`Deseja remover "${deleting?.description || 'este lançamento'}"?`}
        confirmColor="error"
        confirmLabel="Remover"
        isLoading={deleteEntry.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />

      {isMobile && (
        <Fab
          color="primary"
          aria-label="Novo lançamento"
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
