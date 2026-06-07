'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useCategoryDialogs } from '@/features/categories/hooks/useCategoryDialogs';
import { CategoriesHeader } from '@/features/categories/components/list/CategoriesHeader';
import { CategoriesTable } from '@/features/categories/components/list/CategoriesTable';
import { CategoriesPagination } from '@/features/categories/components/list/CategoriesPagination';
import { CategoryFormDialog } from '@/features/categories/components/form/CategoryFormDialog';
import { DeleteCategoryDialog } from '@/features/categories/components/delete/DeleteCategoryDialog';

export function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const dialogs = useCategoryDialogs();

  const { data, isLoading, isFetching, isError } = useCategories({ page, perPage });

  const categories = data?.data ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;

  const handlePerPageChange = (next: number) => {
    setPerPage(next);
    setPage(1);
  };

  return (
    <Stack spacing={3}>
      <CategoriesHeader onCreate={dialogs.openCreate} />

      {isError && <Alert severity="error">Erro ao carregar categorias.</Alert>}
      {isFetching && <LinearProgress />}

      <CategoriesTable
        categories={categories}
        isLoading={isLoading}
        onEdit={dialogs.openEdit}
        onDelete={dialogs.openDelete}
      />

      {totalCount > 0 && (
        <CategoriesPagination
          page={page}
          perPage={perPage}
          totalCount={totalCount}
          onPageChange={setPage}
          onPerPageChange={handlePerPageChange}
        />
      )}

      <CategoryFormDialog
        open={dialogs.isFormOpen}
        category={dialogs.selected}
        onClose={dialogs.close}
      />
      <DeleteCategoryDialog
        open={dialogs.isDeleteOpen}
        category={dialogs.selected}
        onClose={dialogs.close}
      />
    </Stack>
  );
}
