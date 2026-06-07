'use client';

import TablePagination from '@mui/material/TablePagination';
import { useDevice } from '@/hooks/useDevice';

interface DataPaginationProps {
  page: number;
  perPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: number[];
}

export function DataPagination({
  page,
  perPage,
  totalCount,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 25, 50],
}: DataPaginationProps) {
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
      rowsPerPageOptions={isMobile ? [] : perPageOptions}
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
