'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Transaction } from '@/features/transactions/models/transaction.model';
import { TransactionRow } from '@/features/transactions/components/list/TransactionRow';

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  resolveCategoryName: (id?: string | null) => string | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  isLoading,
  resolveCategoryName,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  const isEmpty = !isLoading && transactions.length === 0;

  return (
    <TableContainer component={Paper} className="rounded-2xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={110}>Data</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell align="right">Valor</TableCell>
            <TableCell align="right" width={120}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty && (
            <TableRow>
              <TableCell colSpan={5} align="center" className="py-10">
                <Typography variant="body2" color="text.secondary">
                  Nenhuma transação encontrada.
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              categoryName={
                transaction.category?.name ?? resolveCategoryName(transaction.category_id)
              }
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
