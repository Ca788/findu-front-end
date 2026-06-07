'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useBudgets } from '@/features/budgets/hooks/useBudgets';
import { useBudgetDialogs } from '@/features/budgets/hooks/useBudgetDialogs';
import { DataPagination } from '@/components/common/DataPagination';
import { BudgetsHeader } from '@/features/budgets/components/list/BudgetsHeader';
import { BudgetsTable } from '@/features/budgets/components/list/BudgetsTable';
import { BudgetsCardList } from '@/features/budgets/components/list/BudgetsCardList';
import { BudgetFormDialog } from '@/features/budgets/components/form/BudgetFormDialog';
import { DeleteBudgetDialog } from '@/features/budgets/components/delete/DeleteBudgetDialog';

export function BudgetsPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const dialogs = useBudgetDialogs();

  const { data, isLoading, isFetching, isError } = useBudgets({ page, perPage });

  const budgets = data?.data ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;

  const handlePerPageChange = (next: number) => {
    setPerPage(next);
    setPage(1);
  };

  return (
    <Stack spacing={3}>
      <BudgetsHeader onCreate={dialogs.openCreate} />

      {isError && <Alert severity="error">Erro ao carregar orçamentos.</Alert>}
      {isFetching && <LinearProgress />}

      <div className="hidden md:block">
        <BudgetsTable
          budgets={budgets}
          isLoading={isLoading}
          onEdit={dialogs.openEdit}
          onDelete={dialogs.openDelete}
        />
      </div>
      <div className="md:hidden">
        <BudgetsCardList
          budgets={budgets}
          isLoading={isLoading}
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

      <BudgetFormDialog
        open={dialogs.isFormOpen}
        budget={dialogs.selected}
        onClose={dialogs.close}
      />
      <DeleteBudgetDialog
        open={dialogs.isDeleteOpen}
        budget={dialogs.selected}
        onClose={dialogs.close}
      />
    </Stack>
  );
}
