'use client';

import Typography from '@mui/material/Typography';
import { formatBRL } from '@/utils/currency';
import type { TransactionType } from '@/features/transactions/models/transaction.model';

interface TransactionAmountProps {
  amount: string | number;
  type: TransactionType;
  align?: 'left' | 'right';
}

export function TransactionAmount({ amount, type, align = 'right' }: TransactionAmountProps) {
  const isExpense = type === 'expense';
  const sign = isExpense ? '−' : '+';
  const color = isExpense ? 'error.main' : 'success.main';

  return (
    <Typography
      component="span"
      variant="body2"
      sx={{ color, textAlign: align, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
    >
      {sign} {formatBRL(amount)}
    </Typography>
  );
}
