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

function MetricRow({
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        minWidth: 0,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Realizado {formatBRL(actual)}
        </Typography>
      </Box>
      <Typography
        sx={{
          color,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          fontSize: { xs: '1.05rem', sm: '1.15rem' },
          lineHeight: 1.25,
          textAlign: 'right',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {formatBRL(forecast)}
      </Typography>
    </Box>
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
    <Box className="flex flex-col gap-2.5 findu-anim-fade-in">
      <Paper
        className="overflow-hidden rounded-3xl"
        sx={{
          position: 'relative',
          px: 2.5,
          py: 2.75,
          border: 'none',
          background: `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 58%, ${theme.palette.primary.light} 100%)`,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.1 }}>
            Saldo previsto
          </Typography>
          <Typography
            component="p"
            sx={{
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.04em',
              fontSize: { xs: '2rem', sm: '2.25rem' },
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            {formatBRL(balance)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.25 }}>
            Realizado {formatBRL(balanceActual)} · {positive ? 'No azul' : 'Atenção'}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 3, px: 2.25, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <MetricRow
          label="Receitas"
          forecast={income}
          actual={incomePaid}
          color="success.main"
        />
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />
        <MetricRow
          label="Despesas"
          forecast={expense}
          actual={expensePaid}
          color="error.main"
        />
      </Paper>
    </Box>
  );
}
