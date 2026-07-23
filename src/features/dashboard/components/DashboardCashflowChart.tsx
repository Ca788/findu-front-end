'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useStatementsList } from '@/features/statements/hooks/useStatementsList';
import {
  addMonths,
  currentMonthParam,
  parseMonth,
} from '@/features/statements/utils/month';
import { formatBRL } from '@/utils/currency';

function toNumber(value: string | number | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function monthAxisLabel(month: string): string {
  const date = parseMonth(month);
  return new Intl.DateTimeFormat('pt-BR', { month: 'short' })
    .format(date)
    .replace('.', '')
    .toLowerCase();
}

export function DashboardCashflowChart() {
  const theme = useTheme();
  const to = currentMonthParam();
  const from = addMonths(to, -5);
  const query = useStatementsList({ from, to });

  const rows = useMemo(() => {
    return (query.data ?? [])
      .filter((row) => row.month >= from && row.month <= to)
      .slice()
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((row) => ({
        month: monthAxisLabel(row.month),
        income: toNumber(row.income_paid),
        expense: toNumber(row.expense_paid),
      }));
  }, [query.data, from, to]);

  if (query.isError) return null;
  if (!query.isFetching && rows.length === 0) return null;

  return (
    <Box
      className="findu-anim-fade-in"
      sx={{
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        px: 2,
        pt: 2,
        pb: 1.5,
      }}
    >
      <Typography sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 0.35 }}>
        Fluxo recente
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Entradas e saídas pagas · últimos 6 meses
      </Typography>
      <Box sx={{ width: '100%', height: 220 }}>
        {rows.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
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
        ) : null}
      </Box>
    </Box>
  );
}
