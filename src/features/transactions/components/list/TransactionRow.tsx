'use client';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { formatDateBR } from '@/utils/date';
import { RowActions } from '@/components/common/RowActions';
import type { Transaction } from '@/features/transactions/models/transaction.model';
import { TransactionAmount } from '@/features/transactions/components/list/TransactionAmount';

interface TransactionRowProps {
  transaction: Transaction;
  categoryName: string | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionRow({
  transaction,
  categoryName,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  return (
    <TableRow hover>
      <TableCell>{formatDateBR(transaction.occurred_at ?? transaction.created_at)}</TableCell>
      <TableCell>{transaction.description ?? '—'}</TableCell>
      <TableCell>{categoryName ?? '—'}</TableCell>
      <TableCell align="right">
        <TransactionAmount amount={transaction.amount} type={transaction.transaction_type} />
      </TableCell>
      <TableCell align="right" width={120}>
        <RowActions
          onEdit={() => onEdit(transaction)}
          onDelete={() => onDelete(transaction)}
        />
      </TableCell>
    </TableRow>
  );
}
