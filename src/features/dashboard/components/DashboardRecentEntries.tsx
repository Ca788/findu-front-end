'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { formatBRL } from '@/utils/currency';
import type { Statement } from '@/features/statements/models/statement.model';
import type { Transaction } from '@/features/transactions/models/transaction.model';

interface DashboardRecentEntriesProps {
  statement?: Statement;
  monthParam: string;
}

const RECENT_LIMIT = 6;

function EntryLine({ entry }: { entry: Transaction }) {
  const isIncome = entry.transaction_type === 'income';
  const paid = entry.status === 'paid';
  const tone = isIncome ? 'success.main' : 'error.main';
  const Icon = isIncome ? ArrowUpwardIcon : ArrowDownwardIcon;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          bgcolor: paid ? 'action.hover' : isIncome ? 'success.main' : 'error.main',
          color: paid ? 'text.disabled' : 'primary.contrastText',
          opacity: paid ? 1 : 0.9,
        }}
      >
        <Icon sx={{ fontSize: 18 }} />
      </Box>

      <div className="min-w-0 flex-1">
        <Typography
          variant="body2"
          className="truncate"
          sx={{
            fontWeight: 500,
            textDecoration: paid ? 'line-through' : 'none',
            color: paid ? 'text.disabled' : 'text.primary',
          }}
        >
          {entry.description || (isIncome ? 'Receita' : 'Despesa')}
        </Typography>
        <Typography variant="caption" color="text.secondary" className="truncate block">
          {entry.category?.name ?? 'Sem categoria'} · {paid ? 'pago' : 'pendente'}
        </Typography>
      </div>

      <Typography
        variant="body2"
        sx={{
          flexShrink: 0,
          maxWidth: '42%',
          textAlign: 'right',
          color: paid ? 'text.disabled' : tone,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          textDecoration: paid ? 'line-through' : 'none',
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          wordBreak: 'break-word',
        }}
      >
        {isIncome ? '+' : '−'}
        {formatBRL(entry.amount)}
      </Typography>
    </div>
  );
}

export function DashboardRecentEntries({
  statement,
  monthParam,
}: DashboardRecentEntriesProps) {
  const entries = statement?.entries ?? [];
  const visible = entries.slice(0, RECENT_LIMIT);

  return (
    <Paper className="flex min-w-0 flex-col gap-3.5 rounded-2xl px-4 py-4 md:px-5 md:py-5">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <Typography variant="subtitle1" sx={{ fontWeight: 600, minWidth: 0 }} className="truncate">
          Movimentações
        </Typography>
        <Button
          component={Link}
          href={AppRoutePaths.statementDetail(monthParam)}
          size="small"
          variant="text"
          sx={{ flexShrink: 0 }}
        >
          Ver extrato
        </Button>
      </div>

      {visible.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhum lançamento neste mês.
        </Typography>
      )}

      {visible.length > 0 && (
        <Stack spacing={2}>
          {visible.map((entry) => (
            <EntryLine key={entry.id} entry={entry} />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
