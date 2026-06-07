'use client';

import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import type { Transaction } from '@/features/transactions/models/transaction.model';
import { formatBRL } from '@/utils/currency';
import { formatDateBR } from '@/utils/date';

const RECENT_LIMIT = 5;

function TransactionRow({ tx }: { tx: Transaction }) {
  const isIncome = tx.transaction_type === 'income';
  const amount = Number(tx.amount);
  const tone = isIncome ? 'success.main' : 'error.main';
  const Icon = isIncome ? ArrowUpwardIcon : ArrowDownwardIcon;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon fontSize="small" sx={{ color: tone, flexShrink: 0 }} />
        <div className="min-w-0">
          <Typography variant="body2" className="truncate">
            {tx.description || (isIncome ? 'Receita' : 'Despesa')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {tx.category?.name ?? 'Sem categoria'}
            {tx.occurred_at ? ` · ${formatDateBR(tx.occurred_at)}` : ''}
          </Typography>
        </div>
      </div>
      <Typography
        variant="body2"
        sx={{ color: tone, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
      >
        {isIncome ? '+' : '-'} {formatBRL(amount)}
      </Typography>
    </div>
  );
}

export function DashboardRecentTransactions() {
  const { data, isLoading, isError } = useTransactions({
    page: 1,
    perPage: RECENT_LIMIT,
  });
  const transactions = data?.data ?? [];

  return (
    <Paper className="flex flex-col gap-3 rounded-2xl px-4 py-4 md:px-6 md:py-5">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="subtitle1" className="font-semibold">
          Últimas transações
        </Typography>
        <Button
          component={Link}
          href={AppRoutePaths.TRANSACTIONS}
          size="small"
          variant="text"
        >
          Ver todas
        </Button>
      </div>

      {isError && (
        <Typography variant="body2" color="error.main">
          Erro ao carregar transações.
        </Typography>
      )}

      {isLoading && (
        <LinearProgress variant="indeterminate" sx={{ borderRadius: 999 }} />
      )}

      {!isLoading && !isError && transactions.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhuma transação registrada ainda.
        </Typography>
      )}

      {transactions.length > 0 && (
        <Stack divider={<Divider flexItem />} spacing={1.5}>
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
