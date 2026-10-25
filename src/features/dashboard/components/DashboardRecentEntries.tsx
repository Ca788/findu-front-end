'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { formatBRL } from '@/utils/currency';
import type { Statement } from '@/features/statements/models/statement.model';
import type { Transaction } from '@/features/transactions/models/transaction.model';
import { DashboardCard } from '@/features/dashboard/components/DashboardCard';
import { EmptyState } from '@/components/common/EmptyState';
import { riseDelay } from '@/features/dashboard/components/CycleTransition';

interface DashboardRecentEntriesProps {
  statement?: Statement;
  monthParam: string;
  limit?: number;
}

function EntryLine({ entry, index }: { entry: Transaction; index: number }) {
  const isIncome = entry.transaction_type === 'income';
  const paid = entry.status === 'paid';
  const tone = isIncome ? 'success.main' : 'error.main';
  const Icon = isIncome ? ArrowUpwardIcon : ArrowDownwardIcon;

  return (
    <div className="findu-anim-rise flex min-w-0 items-center gap-3" style={riseDelay(index, 45)}>
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
            color: 'text.primary',
          }}
        >
          {entry.description || (isIncome ? 'Receita' : 'Despesa')}
        </Typography>
        <Typography variant="caption" color="text.secondary" className="truncate block">
          {entry.category?.name ?? 'Sem categoria'}
          {paid ? ' · Pago' : ''}
        </Typography>
      </div>

      <Typography
        variant="body2"
        sx={{
          flexShrink: 0,
          whiteSpace: 'nowrap',
          color: tone,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          opacity: paid ? 0.72 : 1,
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
  limit = 5,
}: DashboardRecentEntriesProps) {
  const entries = statement?.entries ?? [];
  const visible = entries.slice(0, limit);

  return (
    <DashboardCard
      className="findu-anim-rise"
      title="Movimentações"
      action={
        <Button
          component={Link}
          href={AppRoutePaths.statementDetail(monthParam)}
          size="small"
          variant="text"
        >
          Ver tudo
        </Button>
      }
    >
      {visible.length === 0 && (
        <EmptyState
          illustration="coins"
          title="Nenhuma movimentação neste ciclo"
          description="Lance uma despesa ou receita e ela aparece aqui."
          size={72}
        />
      )}

      {visible.length > 0 && (
        <Stack spacing={2.25}>
          {visible.map((entry, index) => (
            <EntryLine key={entry.id} entry={entry} index={index} />
          ))}
        </Stack>
      )}
    </DashboardCard>
  );
}
