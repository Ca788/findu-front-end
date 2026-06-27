'use client';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useSummary } from '@/features/summary/hooks/useSummary';
import { SummaryKpis } from '@/features/summary/components/SummaryKpis';
import { CategoryBreakdown } from '@/features/summary/components/CategoryBreakdown';
import { useDashboardMonth } from '@/features/dashboard/hooks/useDashboardMonth';
import { DashboardWelcome } from '@/features/dashboard/components/DashboardWelcome';
import { DashboardBudgets } from '@/features/dashboard/components/DashboardBudgets';
import { DashboardRecentTransactions } from '@/features/dashboard/components/DashboardRecentTransactions';

export function DashboardPage() {
  const { from, to, referenceDate, monthLabel } = useDashboardMonth();
  const summaryQuery = useSummary({ from, to });

  return (
    <Stack spacing={3}>
      <DashboardWelcome monthLabel={monthLabel} />

      {summaryQuery.isError && (
        <Alert severity="error">Erro ao carregar resumo do mês.</Alert>
      )}
      {summaryQuery.isFetching && <LinearProgress />}

      <SummaryKpis summary={summaryQuery.data} />

      <div className="grid gap-3 lg:grid-cols-2">
        <DashboardBudgets referenceDate={referenceDate} />
        <DashboardRecentTransactions />
      </div>

      <CategoryBreakdown summary={summaryQuery.data} />
    </Stack>
  );
}
