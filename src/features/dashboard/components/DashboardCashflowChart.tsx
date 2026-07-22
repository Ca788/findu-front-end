'use client';

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
import { formatMonthShort } from '@/features/statements/utils/month';
import { formatBRL } from '@/utils/currency';

function toNumber(value: string | number | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function DashboardCashflowChart() {
  const theme = useTheme();
  const query = useStatementsList();
  const rows = (query.data ?? [])
    .slice()
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map((row) => ({
      month: formatMonthShort(row.month),
      income: toNumber(row.income_paid),
      expense: toNumber(row.expense_paid),
      balance: toNumber(row.balance_actual),
    }));

  if (query.isError) return null;
  if (!query.isFetching && rows.length === 0) return null;

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Fluxo dos últimos meses
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Receitas e despesas pagas por competência.
      </Typography>
      <Box sx={{ width: '100%', height: 240 }}>
        {rows.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="finduIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="finduExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E85D4C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E85D4C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
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
                width={56}
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
                }}
                labelStyle={{ color: theme.palette.text.primary }}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Receitas"
                stroke={theme.palette.primary.main}
                fill="url(#finduIncome)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Despesas"
                stroke="#E85D4C"
                fill="url(#finduExpense)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : null}
      </Box>
    </Box>
  );
}
