'use client';

import { useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import SouthWestIcon from '@mui/icons-material/SouthWestRounded';
import NorthEastIcon from '@mui/icons-material/NorthEastRounded';
import { formatBRL } from '@/utils/currency';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type { Statement } from '@/features/statements/models/statement.model';

interface AccountBalanceCardProps {
  statement?: Statement;
}

function almostEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.009;
}

export function AccountBalanceCard({ statement }: AccountBalanceCardProps) {
  const [hidden, setHidden] = useState(false);

  const incomeForecast = Number(statement?.forecast?.income ?? 0);
  const expenseForecast = Number(statement?.forecast?.expense ?? 0);
  const balanceForecast = Number(statement?.forecast?.balance ?? 0);
  const incomePaid = Number(statement?.actual?.income_paid ?? 0);
  const expensePaid = Number(statement?.actual?.expense_paid ?? 0);
  const balanceActual = Number(statement?.actual?.balance ?? 0);

  const showForecastHint = !almostEqual(balanceForecast, balanceActual);
  const money = (value: number) => (hidden ? '••••••' : formatBRL(value));

  return (
    <Box className="findu-anim-fade-in" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '14px',
          px: 2.5,
          pt: 2.25,
          pb: 2.5,
          color: '#F7FAFF',
          background:
            'linear-gradient(155deg, #0C2348 0%, #163A7A 42%, #2F6FE0 100%)',
          boxShadow: '0 8px 24px rgba(15, 47, 92, 0.22)',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            width: 220,
            height: 220,
            right: -60,
            top: -80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, transparent 68%)',
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 14, opacity: 0.9 }}>
            Conta
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              aria-label={hidden ? 'Mostrar valores' : 'Ocultar valores'}
              onClick={() => setHidden((v) => !v)}
              sx={{ color: '#fff', opacity: 0.9 }}
            >
              {hidden ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </IconButton>
            <Typography
              component={Link}
              href={AppRoutePaths.STATEMENTS}
              sx={{
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                opacity: 0.9,
                '&:hover': { opacity: 1 },
              }}
            >
              Extrato
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ position: 'relative', fontSize: 13, opacity: 0.75, mb: 0.5 }}>
          Saldo do mês
        </Typography>
        <Typography
          sx={{
            position: 'relative',
            fontWeight: 750,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.045em',
            fontSize: { xs: '2.35rem', sm: '2.6rem' },
            lineHeight: 1.05,
            mb: showForecastHint ? 0.75 : 0,
          }}
        >
          {money(balanceActual)}
        </Typography>
        {showForecastHint && (
          <Typography sx={{ position: 'relative', fontSize: 13, opacity: 0.72 }}>
            Previsto no mês · {money(balanceForecast)}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.25,
        }}
      >
        <MetricCard
          label="Entradas"
          value={money(incomePaid)}
          hint={
            almostEqual(incomePaid, incomeForecast)
              ? undefined
              : `Previsto ${money(incomeForecast)}`
          }
          tone="income"
          Icon={SouthWestIcon}
        />
        <MetricCard
          label="Saídas"
          value={money(expensePaid)}
          hint={
            almostEqual(expensePaid, expenseForecast)
              ? undefined
              : `Previsto ${money(expenseForecast)}`
          }
          tone="expense"
          Icon={NorthEastIcon}
        />
      </Box>
    </Box>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone,
  Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  tone: 'income' | 'expense';
  Icon: typeof SouthWestIcon;
}) {
  const accent = tone === 'income' ? '#1B8A5A' : '#D64545';
  const soft =
    tone === 'income' ? 'rgba(27,138,90,0.12)' : 'rgba(214,69,69,0.12)';

  return (
    <Box
      sx={{
        borderRadius: '12px',
        px: 1.75,
        py: 1.75,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.1 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: soft,
            color: accent,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
        <Typography
          variant="caption"
          sx={{ fontWeight: 650, color: 'text.secondary', letterSpacing: 0.2 }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 750,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.03em',
          fontSize: '1.15rem',
          lineHeight: 1.2,
          color: 'text.primary',
        }}
      >
        {value}
      </Typography>
      {hint ? (
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 0.35, color: 'text.secondary' }}
        >
          {hint}
        </Typography>
      ) : null}
    </Box>
  );
}
