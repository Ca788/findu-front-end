'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { formatBRL } from '@/utils/currency';
import type { Statement } from '@/features/statements/models/statement.model';

interface StatementKpisProps {
  statement?: Statement;
}

interface KpiProps {
  label: string;
  forecast: number;
  actual: number;
  tone: 'success' | 'error' | 'balance';
}

function tone(value: number, kind: KpiProps['tone']): string {
  if (kind === 'success') return 'success.main';
  if (kind === 'error') return 'error.main';
  return value >= 0 ? 'success.main' : 'error.main';
}

function Kpi({ label, forecast, actual, tone: kind }: KpiProps) {
  return (
    <Paper className="flex flex-col gap-1 rounded-2xl px-4 py-4">
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography
        variant="h5"
        component="span"
        sx={{ color: tone(forecast, kind), fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
      >
        {formatBRL(forecast)}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Realizado: {formatBRL(actual)}
      </Typography>
    </Paper>
  );
}

export function StatementKpis({ statement }: StatementKpisProps) {
  const forecast = statement?.forecast;
  const actual = statement?.actual;

  const income = Number(forecast?.income ?? 0);
  const expense = Number(forecast?.expense ?? 0);
  const balance = Number(forecast?.balance ?? 0);

  const incomePaid = Number(actual?.income_paid ?? 0);
  const expensePaid = Number(actual?.expense_paid ?? 0);
  const balanceActual = Number(actual?.balance ?? 0);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      <Kpi label="Receitas previstas" forecast={income} actual={incomePaid} tone="success" />
      <Kpi label="Despesas previstas" forecast={expense} actual={expensePaid} tone="error" />
      <Kpi label="Saldo previsto" forecast={balance} actual={balanceActual} tone="balance" />
    </div>
  );
}
