'use client';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useDashboardMonth } from '@/features/dashboard/hooks/useDashboardMonth';
import { DashboardWelcome } from '@/features/dashboard/components/DashboardWelcome';
import { DashboardQuickActions } from '@/features/dashboard/components/DashboardQuickActions';
import { DashboardBudgets } from '@/features/dashboard/components/DashboardBudgets';
import { DashboardBoxes } from '@/features/dashboard/components/DashboardBoxes';
import { DashboardRecentEntries } from '@/features/dashboard/components/DashboardRecentEntries';
import { DashboardCashflowChart } from '@/features/dashboard/components/DashboardCashflowChart';
import { CycleTransition } from '@/features/dashboard/components/CycleTransition';
import { useStatement } from '@/features/statements/hooks/useStatement';
import { AccountBalanceCard } from '@/features/statements/components/AccountBalanceCard';
import { DashboardInsights } from '@/features/insights/components/DashboardInsights';

export function DashboardMobileHome() {
  const cycle = useDashboardMonth();
  const statementQuery = useStatement(cycle.monthParam);
  const loading = statementQuery.isFetching && !statementQuery.data;

  return (
    <Stack spacing={2.25} className="min-w-0">
      <DashboardWelcome cycle={cycle} />

      {statementQuery.isError && (
        <Alert severity="error" sx={{ borderRadius: '14px' }}>
          Erro ao carregar extrato do mês.
        </Alert>
      )}

      <CycleTransition cycle={cycle}>
        <Stack spacing={2.25} className="min-w-0">
          <AccountBalanceCard statement={statementQuery.data} loading={loading} />
          <DashboardQuickActions monthParam={cycle.monthParam} variant="icons" />
          <DashboardRecentEntries statement={statementQuery.data} monthParam={cycle.monthParam} limit={3} />
        </Stack>
      </CycleTransition>
      <DashboardBoxes limit={2} />
      <CycleTransition cycle={cycle}>
        <Stack spacing={2.25} className="min-w-0">
          <DashboardInsights period={cycle.monthParam} limit={1} />
          <DashboardCashflowChart height={200} monthParam={cycle.monthParam} />
          <DashboardBudgets referenceDate={cycle.referenceDate} />
        </Stack>
      </CycleTransition>
    </Stack>
  );
}
