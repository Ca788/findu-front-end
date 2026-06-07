'use client';

import { formatBRL } from '@/utils/currency';
import { KpiCard } from '@/features/summary/components/KpiCard';
import type { Summary } from '@/features/summary/models/summary.model';

interface SummaryKpisProps {
  summary?: Summary;
}

export function SummaryKpis({ summary }: SummaryKpisProps) {
  const income = Number(summary?.by_type?.income ?? 0);
  const expense = Number(summary?.by_type?.expense ?? 0);
  const balance = income - expense;
  const count = summary?.transaction_count ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard label="Receitas" value={formatBRL(income)} tone="success" />
      <KpiCard label="Despesas" value={formatBRL(expense)} tone="error" />
      <KpiCard
        label="Saldo"
        value={formatBRL(balance)}
        tone={balance >= 0 ? 'success' : 'error'}
      />
      <KpiCard label="Transações" value={String(count)} />
    </div>
  );
}
