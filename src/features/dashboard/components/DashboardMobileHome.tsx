'use client';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useDashboardMonth } from '@/features/dashboard/hooks/useDashboardMonth';
import { DashboardWelcome } from '@/features/dashboard/components/DashboardWelcome';
import { DashboardQuickActions } from '@/features/dashboard/components/DashboardQuickActions';
import { DashboardBudgets } from '@/features/dashboard/components/DashboardBudgets';
import { DashboardRecentEntries } from '@/features/dashboard/components/DashboardRecentEntries';
import { DashboardCashflowChart } from '@/features/dashboard/components/DashboardCashflowChart';
import { useStatement } from '@/features/statements/hooks/useStatement';
import { AccountBalanceCard } from '@/features/statements/components/AccountBalanceCard';
import { DashboardInsights } from '@/features/insights/components/DashboardInsights';

export function DashboardMobileHome() {
  const { monthParam, referenceDate, monthLabel, onPreviousMonth, onNextMonth } =
    useDashboardMonth();
  const statementQuery = useStatement(monthParam);

  return (
    <Stack spacing={2.25} className="min-w-0">
      <DashboardWelcome
        monthLabel={monthLabel}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />

      {statementQuery.isError && (
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          Erro ao carregar extrato do mês.
        </Alert>
      )}
      {statementQuery.isFetching && !statementQuery.data && (
        <LinearProgress sx={{ borderRadius: 999, height: 3 }} />
      )}

      <AccountBalanceCard statement={statementQuery.data} />
      <DashboardQuickActions monthParam={monthParam} variant="icons" />
      <DashboardRecentEntries
        statement={statementQuery.data}
        monthParam={monthParam}
        limit={3}
      />
      <DashboardInsights period={monthParam} limit={1} />
      <DashboardCashflowChart height={200} />
      <DashboardBudgets referenceDate={referenceDate} />
    </Stack>
  );
}
