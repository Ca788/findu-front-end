'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { formatDateBR } from '@/utils/date';
import { RowActions } from '@/components/common/RowActions';
import type { Transaction } from '@/features/transactions/models/transaction.model';
import { TransactionAmount } from '@/features/transactions/components/list/TransactionAmount';

interface TransactionCardItemProps {
  transaction: Transaction;
  categoryName: string | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionCardItem({
  transaction,
  categoryName,
  onEdit,
  onDelete,
}: TransactionCardItemProps) {
  return (
    <Paper className="flex items-start gap-3 rounded-2xl px-4 py-3">
      <div className="min-w-0 flex-1">
        <Typography variant="body1" className="truncate font-medium">
          {transaction.description ?? 'Sem descrição'}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div">
          {formatDateBR(transaction.occurred_at ?? transaction.created_at)}
          {categoryName ? ` · ${categoryName}` : ''}
        </Typography>
        <div className="mt-1.5">
          <TransactionAmount
            amount={transaction.amount}
            type={transaction.transaction_type}
            align="left"
          />
        </div>
      </div>
      <RowActions
        onEdit={() => onEdit(transaction)}
        onDelete={() => onDelete(transaction)}
      />
    </Paper>
  );
}
