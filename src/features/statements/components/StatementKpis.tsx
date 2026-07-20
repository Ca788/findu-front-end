'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { formatBRL } from '@/utils/currency';
import type { Statement } from '@/features/statements/models/statement.model';

interface StatementKpisProps {
  statement?: Statement;
}

function MetricCard({
  label,
  forecast,
  actual,
  color,
}: {
  label: string;
  forecast: number;
  actual: number;
  color: string;
}) {
  return (
    <Paper
      className="min-w-0 rounded-2xl px-3.5 py-3.5"
      sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        className="truncate"
        sx={{ letterSpacing: 0.2 }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        component="span"
        className="truncate"
        sx={{
          color,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          fontSize: { xs: '1.05rem', sm: '1.25rem' },
          lineHeight: 1.2,
        }}
      >
        {formatBRL(forecast)}
      </Typography>
      <Typography variant="caption" color="text.secondary" className="truncate">
        Realizado {formatBRL(actual)}
      </Typography>
    </Paper>
  );
}

export function StatementKpis({ statement }: StatementKpisProps) {
  const theme = useTheme();
  const forecast = statement?.forecast;
  const actual = statement?.actual;

  const income = Number(forecast?.income ?? 0);
  const expense = Number(forecast?.expense ?? 0);
  const balance = Number(forecast?.balance ?? 0);
  const incomePaid = Number(actual?.income_paid ?? 0);
  const expensePaid = Number(actual?.expense_paid ?? 0);
  const balanceActual = Number(actual?.balance ?? 0);
  const positive = balance >= 0;

  return (
    <Box className="flex flex-col gap-3 findu-anim-fade-in">
      <Paper
        className="overflow-hidden rounded-3xl"
        sx={{
          position: 'relative',
          px: { xs: 2.25, sm: 3 },
          py: { xs: 2.5, sm: 3 },
          border: 'none',
          background: `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 55%, ${theme.palette.primary.light} 100%)`,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.18,
            background:
              'radial-gradient(80% 70% at 100% 0%, #fff 0%, transparent 55%), radial-gradient(60% 50% at 0% 100%, #fff 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography
            variant="overline"
            sx={{ opacity: 0.85, letterSpacing: 1, lineHeight: 1.2 }}
          >
            Saldo previsto
          </Typography>
          <Typography
            variant="h4"
            component="p"
            sx={{
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.03em',
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              lineHeight: 1.15,
              wordBreak: 'break-word',
            }}
          >
            {formatBRL(balance)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Realizado {formatBRL(balanceActual)}
            <Box component="span" sx={{ mx: 1, opacity: 0.5 }}>
              ·
            </Box>
            {positive ? 'No azul' : 'Atenção ao saldo'}
          </Typography>
        </Box>
      </Paper>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Receitas"
          forecast={income}
          actual={incomePaid}
          color="success.main"
        />
        <MetricCard
          label="Despesas"
          forecast={expense}
          actual={expensePaid}
          color="error.main"
        />
      </div>
    </Box>
  );
}
