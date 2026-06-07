'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Transaction } from '@/features/transactions/models/transaction.model';
import { TransactionCardItem } from '@/features/transactions/components/list/TransactionCardItem';

interface TransactionsCardListProps {
  transactions: Transaction[];
  isLoading: boolean;
  resolveCategoryName: (id?: string | null) => string | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionsCardList({
  transactions,
  isLoading,
  resolveCategoryName,
  onEdit,
  onDelete,
}: TransactionsCardListProps) {
  if (!isLoading && transactions.length === 0) {
    return (
      <Paper className="rounded-2xl px-4 py-10 text-center">
        <Typography variant="body2" color="text.secondary">
          Nenhuma transação encontrada.
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {transactions.map((transaction) => (
        <TransactionCardItem
          key={transaction.id}
          transaction={transaction}
          categoryName={
            transaction.category?.name ?? resolveCategoryName(transaction.category_id)
          }
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
