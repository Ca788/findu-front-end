'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DataPagination } from '@/components/common/DataPagination';
import { StatementMonthSwitcher } from '@/features/statements/components/StatementMonthSwitcher';
import { useCategoryTotals } from '@/features/categories/hooks/useCategoryTotals';
import { currentMonthParam } from '@/features/statements/utils/month';
import { formatBRL } from '@/utils/currency';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type { CategoryTotal } from '@/features/categories/models/category.model';

function TotalsRow({
  row,
  onOpen,
}: {
  row: CategoryTotal;
  onOpen: (row: CategoryTotal) => void;
}) {
  const clickable = !!row.category_id;

  return (
    <TableRow
      hover={clickable}
      onClick={clickable ? () => onOpen(row) : undefined}
      sx={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      <TableCell>{row.category_name}</TableCell>
      <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatBRL(row.income)}
      </TableCell>
      <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatBRL(row.expense)}
      </TableCell>
      <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatBRL(row.balance)}
      </TableCell>
      <TableCell align="right">{row.transactions_count ?? '—'}</TableCell>
    </TableRow>
  );
}

function TotalsCard({
  row,
  onOpen,
}: {
  row: CategoryTotal;
  onOpen: (row: CategoryTotal) => void;
}) {
  const clickable = !!row.category_id;

  return (
    <Paper
      className="flex flex-col gap-1.5 rounded-2xl px-4 py-3"
      onClick={clickable ? () => onOpen(row) : undefined}
      sx={{ cursor: clickable ? 'pointer' : 'default' }}
      role={clickable ? 'button' : undefined}
    >
      <Typography variant="body1" className="font-medium">
        {row.category_name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {row.transactions_count ?? 0} lançamentos
      </Typography>
      <div className="flex justify-between gap-2">
        <Typography variant="caption" color="success.main" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          +{formatBRL(row.income)}
        </Typography>
        <Typography variant="caption" color="error.main" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          −{formatBRL(row.expense)}
        </Typography>
        <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
          {formatBRL(row.balance)}
        </Typography>
      </div>
    </Paper>
  );
}

export function CategoryTotalsSection() {
  const router = useRouter();
  const [month, setMonth] = useState(currentMonthParam);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isFetching, isError } = useCategoryTotals({
    page,
    perPage,
    from: month,
    to: month,
    view: 'extended',
  });

  const rows = data?.data ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;

  const openCategory = (row: CategoryTotal) => {
    if (!row.category_id) return;
    router.push(AppRoutePaths.categoryDetail(row.category_id, month));
  };

  const handleMonthChange = (next: string) => {
    setMonth(next);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Totais do mês
        </Typography>
        <StatementMonthSwitcher month={month} onChange={handleMonthChange} />
      </div>

      {isError && <Alert severity="error">Erro ao carregar totais por categoria.</Alert>}
      {isFetching && <LinearProgress />}

      <div className="hidden md:block">
        <TableContainer component={Paper} className="rounded-2xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell align="right">Receitas</TableCell>
                <TableCell align="right">Despesas</TableCell>
                <TableCell align="right">Saldo</TableCell>
                <TableCell align="right">Lançamentos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="py-10">
                    <Typography variant="body2" color="text.secondary">
                      Nenhum lançamento neste mês.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {rows.map((row) => (
                <TotalsRow
                  key={row.category_id ?? 'uncategorized'}
                  row={row}
                  onOpen={openCategory}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="flex flex-col gap-2 md:hidden">
        {!isLoading && rows.length === 0 && (
          <Paper className="rounded-2xl px-4 py-10 text-center">
            <Typography variant="body2" color="text.secondary">
              Nenhum lançamento neste mês.
            </Typography>
          </Paper>
        )}
        {rows.map((row) => (
          <TotalsCard
            key={row.category_id ?? 'uncategorized'}
            row={row}
            onOpen={openCategory}
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
    </div>
  );
}
