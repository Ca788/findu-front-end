'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useStatementsList } from '@/features/statements/hooks/useStatementsList';
import {
  addMonths,
  currentMonthParam,
  formatMonthShort,
  parseMonth,
} from '@/features/statements/utils/month';
import { formatBRL } from '@/utils/currency';
import { DashboardEmptyState } from '@/features/dashboard/components/DashboardEmptyState';

function toNumber(value: string | number | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function ChartKey({ color, label }: { color: string; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

function monthAxisLabel(month: string): string {
  const date = parseMonth(month);
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' })
    .format(date)
    .replace('.', '')
    .toLowerCase();
}

interface DashboardCashflowChartProps {
  height?: number;
  monthParam?: string;
}

export function DashboardCashflowChart({ height = 220, monthParam }: DashboardCashflowChartProps) {
  const theme = useTheme();
  const to = monthParam ?? currentMonthParam();
  const from = addMonths(to, -5);
  const query = useStatementsList({ from, to });

  const rows = useMemo(() => {
    const byMonth = new Map((query.data ?? []).map((row) => [row.month, row]));
    return Array.from({ length: 6 }, (_, index) => addMonths(from, index)).map((month) => {
      const row = byMonth.get(month);
      return {
        key: month,
        month: monthAxisLabel(month),
        income: toNumber(row?.income_paid),
        expense: toNumber(row?.expense_paid),
      };
    });
  }, [query.data, from]);

  const hasData = rows.some((row) => row.income > 0 || row.expense > 0);
  const selectedLabel = monthAxisLabel(to);

  if (query.isError) return null;

  return (
    <Box
      className="findu-anim-rise"
      sx={{
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        px: 2,
        pt: 2,
        pb: 1.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}
    >
      <Typography sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 0.35 }}>
        Fluxo recente
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 1.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Entradas e saídas pagas · 6 meses até {formatMonthShort(to)}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <ChartKey color={theme.palette.primary.main} label="Entradas" />
          <ChartKey color="#E85D4C" label="Saídas" />
        </Box>
      </Box>
      <Box sx={{ width: '100%', height, flex: 1, minHeight: height }}>
        {query.isFetching && !query.data ? (
          <Skeleton variant="rounded" width="100%" height="100%" sx={{ borderRadius: '10px' }} />
        ) : !hasData ? (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
            <DashboardEmptyState
              illustration="rocket"
              title="Sem fluxo neste período"
              description="Registre receitas e despesas para ver a curva dos seus ciclos."
              size={72}
            />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart key={to} data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="finduIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.32} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="finduExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E85D4C" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#E85D4C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v) =>
                  new Intl.NumberFormat('pt-BR', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(Number(v))
                }
              />
              <ReferenceLine
                x={selectedLabel}
                stroke={theme.palette.primary.main}
                strokeDasharray="4 4"
                strokeOpacity={0.7}
                label={{
                  value: 'ciclo',
                  position: 'insideTopRight',
                  fill: theme.palette.primary.main,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
              <Tooltip
                formatter={(value) => formatBRL(Number(value ?? 0))}
                contentStyle={{
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                }}
                labelStyle={{ color: theme.palette.text.primary, fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Entradas"
                stroke={theme.palette.primary.main}
                fill="url(#finduIncome)"
                strokeWidth={2.25}
                animationDuration={650}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Saídas"
                stroke="#E85D4C"
                fill="url(#finduExpense)"
                strokeWidth={2.25}
                animationDuration={650}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}
