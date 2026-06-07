'use client';

import TablePagination from '@mui/material/TablePagination';

interface CategoriesPaginationProps {
  page: number;
  perPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function CategoriesPagination({
  page,
  perPage,
  totalCount,
  onPageChange,
  onPerPageChange,
}: CategoriesPaginationProps) {
  return (
    <TablePagination
      component="div"
      count={totalCount}
      page={page - 1}
      onPageChange={(_, nextPage) => onPageChange(nextPage + 1)}
      rowsPerPage={perPage}
      onRowsPerPageChange={(event) =>
        onPerPageChange(Number(event.target.value))
      }
      rowsPerPageOptions={[10, 25, 50]}
      labelRowsPerPage="Por página"
      labelDisplayedRows={({ from, to, count }) =>
        `${from}–${to} de ${count}`
      }
    />
  );
}
