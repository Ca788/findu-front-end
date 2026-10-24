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
import Skeleton from '@mui/material/Skeleton';
import { formatBRL } from '@/utils/currency';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { AnimatedMoney } from '@/features/dashboard/components/AnimatedMoney';
import type { Statement } from '@/features/statements/models/statement.model';
import type { CSSProperties, ReactNode } from 'react';

interface AccountBalanceCardProps {
  statement?: Statement;
  loading?: boolean;
}

interface AccountBalanceHeroProps {
  statement?: Statement;
  loading?: boolean;
  hidden: boolean;
  onToggleHidden: () => void;
}

interface AccountBalanceMetricsProps {
  statement?: Statement;
  loading?: boolean;
  hidden: boolean;
}

function almostEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.009;
}

export function useHiddenBalance() {
  const [hidden, setHidden] = useState(false);
  return { hidden, toggleHidden: () => setHidden((v) => !v) };
}

export function AccountBalanceCard({ statement, loading = false }: AccountBalanceCardProps) {
  const { hidden, toggleHidden } = useHiddenBalance();

  return (
    <Box className="findu-anim-fade-in" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <AccountBalanceHero
        statement={statement}
        loading={loading}
        hidden={hidden}
        onToggleHidden={toggleHidden}
      />
      <AccountBalanceMetrics statement={statement} loading={loading} hidden={hidden} />
    </Box>
  );
}

export function AccountBalanceHero({
  statement,
  loading = false,
  hidden,
  onToggleHidden,
}: AccountBalanceHeroProps) {
  const balanceForecast = Number(statement?.forecast?.balance ?? 0);
  const balanceActual = Number(statement?.actual?.balance ?? 0);
  const showForecastHint = !almostEqual(balanceForecast, balanceActual);
  const money = (value: number) => (hidden ? '••••••' : formatBRL(value));

  if (loading && !statement) {
    return <Skeleton variant="rounded" sx={{ borderRadius: '14px', height: '100%', minHeight: 168 }} />;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        px: 2.5,
        pt: 2.25,
        pb: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
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
            onClick={onToggleHidden}
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

      <Box sx={{ position: 'relative', mt: 'auto' }}>
        <Typography sx={{ fontSize: 13, opacity: 0.75, mb: 0.5 }}>
          Saldo do mês
        </Typography>
        <Typography
          sx={{
            fontWeight: 750,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.045em',
            fontSize: { xs: '2.35rem', sm: '2.6rem' },
            lineHeight: 1.05,
            mb: showForecastHint ? 0.75 : 0,
          }}
        >
          <AnimatedMoney value={balanceActual} hidden={hidden} />
        </Typography>
        {showForecastHint && (
          <Typography sx={{ fontSize: 13, opacity: 0.72 }}>
            Previsto no mês · {money(balanceForecast)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export function AccountBalanceMetrics({
  statement,
  loading = false,
  hidden,
}: AccountBalanceMetricsProps) {
  const incomeForecast = Number(statement?.forecast?.income ?? 0);
  const expenseForecast = Number(statement?.forecast?.expense ?? 0);
  const incomePaid = Number(statement?.actual?.income_paid ?? 0);
  const expensePaid = Number(statement?.actual?.expense_paid ?? 0);
  const money = (value: number) => (hidden ? '••••••' : formatBRL(value));

  if (loading && !statement) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, height: '100%' }}>
        <Skeleton variant="rounded" sx={{ borderRadius: '14px', height: '100%', minHeight: 96 }} />
        <Skeleton variant="rounded" sx={{ borderRadius: '14px', height: '100%', minHeight: 96 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, height: '100%' }}>
      <MetricCard
        label="Entradas"
        value={<AnimatedMoney value={incomePaid} hidden={hidden} />}
        hint={
          almostEqual(incomePaid, incomeForecast)
            ? undefined
            : `Previsto ${money(incomeForecast)}`
        }
        tone="income"
        Icon={SouthWestIcon}
        delay={80}
      />
      <MetricCard
        label="Saídas"
        value={<AnimatedMoney value={expensePaid} hidden={hidden} />}
        hint={
          almostEqual(expensePaid, expenseForecast)
            ? undefined
            : `Previsto ${money(expenseForecast)}`
        }
        tone="expense"
        Icon={NorthEastIcon}
        delay={140}
      />
    </Box>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone,
  Icon,
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone: 'income' | 'expense';
  Icon: typeof SouthWestIcon;
  delay?: number;
}) {
  const accent = tone === 'income' ? '#1B8A5A' : '#D64545';
  const soft =
    tone === 'income' ? 'rgba(27,138,90,0.12)' : 'rgba(214,69,69,0.12)';

  return (
    <Box
      className="findu-anim-rise"
      style={{ '--findu-delay': `${delay}ms` } as CSSProperties}
      sx={{
        borderRadius: '14px',
        px: 2,
        py: 1.75,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
