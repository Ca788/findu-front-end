'use client';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useDashboardMonth } from '@/features/dashboard/hooks/useDashboardMonth';
import { DashboardWelcome } from '@/features/dashboard/components/DashboardWelcome';
import { DashboardBudgets } from '@/features/dashboard/components/DashboardBudgets';
import { DashboardRecentEntries } from '@/features/dashboard/components/DashboardRecentEntries';
import { DashboardCashflowChart } from '@/features/dashboard/components/DashboardCashflowChart';
import { DashboardEndingInstallments } from '@/features/dashboard/components/DashboardEndingInstallments';
import { useStatement } from '@/features/statements/hooks/useStatement';
import { AccountBalanceCard } from '@/features/statements/components/AccountBalanceCard';
import { StatementSideLists } from '@/features/statements/components/StatementSideLists';

export function DashboardPage() {
  const { monthParam, referenceDate, monthLabel } = useDashboardMonth();
  const statementQuery = useStatement(monthParam);

  return (
    <Stack spacing={{ xs: 2.25, sm: 2.75 }} className="min-w-0">
      <DashboardWelcome monthLabel={monthLabel} />

      {statementQuery.isError && (
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          Erro ao carregar extrato do mês.
        </Alert>
      )}
      {statementQuery.isFetching && !statementQuery.data && (
        <LinearProgress sx={{ borderRadius: 999, height: 3 }} />
      )}

      <DashboardEndingInstallments />

      <AccountBalanceCard statement={statementQuery.data} />

      <DashboardCashflowChart />

      <div className="grid min-w-0 gap-3 lg:grid-cols-2">
        <DashboardBudgets referenceDate={referenceDate} />
        <DashboardRecentEntries
          statement={statementQuery.data}
          monthParam={monthParam}
        />
      </div>

      <StatementSideLists statement={statementQuery.data} compact />
    </Stack>
  );
}
