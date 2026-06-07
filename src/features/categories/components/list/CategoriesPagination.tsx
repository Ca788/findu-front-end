'use client';

import TablePagination from '@mui/material/TablePagination';
import { useDevice } from '@/hooks/useDevice';

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
  const { isMobile } = useDevice();

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
      rowsPerPageOptions={isMobile ? [] : [10, 25, 50]}
      labelRowsPerPage={isMobile ? '' : 'Por página'}
      labelDisplayedRows={({ from, to, count }) =>
        isMobile ? `${from}–${to}/${count}` : `${from}–${to} de ${count}`
      }
      sx={{
        '.MuiTablePagination-toolbar': {
          paddingLeft: { xs: 0, sm: 2 },
          paddingRight: { xs: 0, sm: 2 },
          minHeight: { xs: 48, sm: 52 },
        },
      }}
    />
  );
}
