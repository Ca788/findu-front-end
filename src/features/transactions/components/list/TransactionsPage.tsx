'use client';

import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { useTransactionDialogs } from '@/features/transactions/hooks/useTransactionDialogs';
import { useTransactionFilters } from '@/features/transactions/hooks/useTransactionFilters';
import { useCategoriesMap } from '@/features/categories/hooks/useCategoriesMap';
import { TransactionsHeader } from '@/features/transactions/components/list/TransactionsHeader';
import { TransactionsTable } from '@/features/transactions/components/list/TransactionsTable';
import { TransactionsCardList } from '@/features/transactions/components/list/TransactionsCardList';
import { DataPagination } from '@/components/common/DataPagination';
import { TransactionsFilters } from '@/features/transactions/components/filters/TransactionsFilters';
import { TransactionFormDialog } from '@/features/transactions/components/form/TransactionFormDialog';
import { DeleteTransactionDialog } from '@/features/transactions/components/delete/DeleteTransactionDialog';

export function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { filters, update, reset, hasFilters } = useTransactionFilters();
  const dialogs = useTransactionDialogs();
  const { resolveName: resolveCategoryName } = useCategoriesMap();

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading, isFetching, isError } = useTransactions({
    page,
    perPage,
    ...filters,
  });

  const transactions = data?.data ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;

  const handlePerPageChange = (next: number) => {
    setPerPage(next);
    setPage(1);
  };

  return (
    <Stack spacing={3}>
      <TransactionsHeader onCreate={dialogs.openCreate} />

      <TransactionsFilters
        filters={filters}
        onChange={update}
        onReset={reset}
        hasFilters={hasFilters}
      />

      {isError && <Alert severity="error">Erro ao carregar transações.</Alert>}
      {isFetching && <LinearProgress />}

      <div className="hidden md:block">
        <TransactionsTable
          transactions={transactions}
          isLoading={isLoading}
          resolveCategoryName={resolveCategoryName}
          onEdit={dialogs.openEdit}
          onDelete={dialogs.openDelete}
        />
      </div>
      <div className="md:hidden">
        <TransactionsCardList
          transactions={transactions}
          isLoading={isLoading}
          resolveCategoryName={resolveCategoryName}
          onEdit={dialogs.openEdit}
          onDelete={dialogs.openDelete}
        />
      </div>

      {totalCount > 0 && (
        <DataPagination
          page={page}
          perPage={perPage}
          totalCount={totalCount}
          onPageChange={setPage}
          onPerPageChange={handlePerPageChange}
        />
      )}

      <TransactionFormDialog
        open={dialogs.isFormOpen}
        transaction={dialogs.selected}
        onClose={dialogs.close}
      />
      <DeleteTransactionDialog
        open={dialogs.isDeleteOpen}
        transaction={dialogs.selected}
        onClose={dialogs.close}
      />
    </Stack>
  );
}
