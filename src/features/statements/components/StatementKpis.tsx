'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { formatBRL } from '@/utils/currency';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
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
          border: '1px solid',
          borderColor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(15,47,92,0.12)',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, #0B1A2E 0%, #12305A 52%, #1A4578 100%)'
              : 'linear-gradient(145deg, #0F2F5C 0%, #1E4F96 55%, #2F6FE0 100%)',
          color: '#F5F8FC',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 18px 40px rgba(0,0,0,0.35)'
              : '0 14px 32px rgba(15,47,92,0.18)',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(120% 80% at 100% 0%, rgba(75,134,240,0.22) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography
              sx={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}
            >
              Conta
            </Typography>
            <Typography
              component={Link}
              href={AppRoutePaths.STATEMENTS}
              sx={{
                color: 'inherit',
                opacity: 0.85,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { opacity: 1 },
              }}
            >
              Ver extrato ›
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.78, fontWeight: 500 }}>
            Saldo previsto
          </Typography>
          <Typography
            component="p"
            sx={{
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.04em',
              fontSize: { xs: '2.1rem', sm: '2.35rem' },
              lineHeight: 1.05,
              whiteSpace: 'nowrap',
            }}
          >
            {formatBRL(balance)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.82 }}>
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
