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

const RECENT_LIMIT = 5;

function EntryLine({ entry }: { entry: Transaction }) {
  const isIncome = entry.transaction_type === 'income';
  const paid = entry.status === 'paid';
  const tone = isIncome ? 'success.main' : 'error.main';
  const Icon = isIncome ? ArrowUpwardIcon : ArrowDownwardIcon;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          bgcolor: paid ? 'action.hover' : 'action.selected',
          color: paid ? 'text.disabled' : tone,
        }}
      >
        <Icon sx={{ fontSize: 18 }} />
      </Box>

      <div className="min-w-0 flex-1">
        <Typography
          variant="body2"
          className="truncate"
          sx={{
            fontWeight: 600,
            textDecoration: paid ? 'line-through' : 'none',
            color: paid ? 'text.disabled' : 'text.primary',
          }}
        >
          {entry.description || (isIncome ? 'Receita' : 'Despesa')}
        </Typography>
        <Typography variant="caption" color="text.secondary" className="truncate block">
          {entry.category?.name ?? 'Sem categoria'}
        </Typography>
      </div>

      <Typography
        variant="body2"
        sx={{
          flexShrink: 0,
          whiteSpace: 'nowrap',
          color: paid ? 'text.disabled' : tone,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          textDecoration: paid ? 'line-through' : 'none',
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
    <Paper className="flex min-w-0 flex-col gap-3.5 rounded-xl px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Movimentações
        </Typography>
        <Button
          component={Link}
          href={AppRoutePaths.statementDetail(monthParam)}
          size="small"
          variant="text"
        >
          Ver tudo
        </Button>
      </div>

      {visible.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhuma movimentação neste mês.
        </Typography>
      )}

      {visible.length > 0 && (
        <Stack spacing={2.25}>
          {visible.map((entry) => (
            <EntryLine key={entry.id} entry={entry} />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
