'use client';

import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
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
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon fontSize="small" sx={{ color: paid ? 'text.disabled' : tone, flexShrink: 0 }} />
        <div className="min-w-0">
          <Typography
            variant="body2"
            className="truncate"
            sx={{
              textDecoration: paid ? 'line-through' : 'none',
              color: paid ? 'text.disabled' : 'text.primary',
            }}
          >
            {entry.description || (isIncome ? 'Receita' : 'Despesa')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {entry.category?.name ?? 'Sem categoria'} · {paid ? 'pago' : 'pendente'}
          </Typography>
        </div>
      </div>
      <Typography
        variant="body2"
        sx={{
          color: paid ? 'text.disabled' : tone,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          textDecoration: paid ? 'line-through' : 'none',
        }}
      >
        {isIncome ? '+' : '-'} {formatBRL(entry.amount)}
      </Typography>
    </div>
  );
}

export function DashboardRecentEntries({ statement, monthParam }: DashboardRecentEntriesProps) {
  const entries = statement?.entries ?? [];
  const visible = entries.slice(0, RECENT_LIMIT);

  return (
    <Paper className="flex flex-col gap-3 rounded-2xl px-4 py-4 md:px-6 md:py-5">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="subtitle1" className="font-semibold">
          Lançamentos do mês
        </Typography>
        <Button
          component={Link}
          href={`${AppRoutePaths.STATEMENTS}/${monthParam}`}
          size="small"
          variant="text"
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
        <Stack divider={<Divider flexItem />} spacing={1.5}>
          {visible.map((entry) => (
            <EntryLine key={entry.id} entry={entry} />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
