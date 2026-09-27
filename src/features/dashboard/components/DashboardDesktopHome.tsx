'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useDashboardMonth } from '@/features/dashboard/hooks/useDashboardMonth';
import { DashboardWelcome } from '@/features/dashboard/components/DashboardWelcome';
import { DashboardQuickActions } from '@/features/dashboard/components/DashboardQuickActions';
import { DashboardBudgets } from '@/features/dashboard/components/DashboardBudgets';
import { DashboardRecentEntries } from '@/features/dashboard/components/DashboardRecentEntries';
import { DashboardCashflowChart } from '@/features/dashboard/components/DashboardCashflowChart';
import { DashboardEndingInstallments } from '@/features/dashboard/components/DashboardEndingInstallments';
import { useStatement } from '@/features/statements/hooks/useStatement';
import { AccountBalanceCard } from '@/features/statements/components/AccountBalanceCard';
import { StatementSideLists } from '@/features/statements/components/StatementSideLists';
import { DashboardInsights } from '@/features/insights/components/DashboardInsights';

export function DashboardDesktopHome() {
  const { monthParam, referenceDate, monthLabel, onPreviousMonth, onNextMonth } =
    useDashboardMonth();
  const statementQuery = useStatement(monthParam);

  return (
    <Stack spacing={2.5} className="min-w-0">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <DashboardWelcome
          monthLabel={monthLabel}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
        />
        <DashboardQuickActions monthParam={monthParam} variant="buttons" />
      </Box>

      {statementQuery.isError && (
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          Erro ao carregar extrato do mês.
        </Alert>
      )}
      {statementQuery.isFetching && !statementQuery.data && (
        <LinearProgress sx={{ borderRadius: 999, height: 3 }} />
      )}

      <Box
        sx={{
          display: 'grid',
          alignItems: 'start',
          gap: 2.5,
          gridTemplateColumns: 'minmax(0, 1.7fr) minmax(260px, 0.9fr)',
        }}
      >
        <Stack spacing={2.5} className="min-w-0">
          <AccountBalanceCard statement={statementQuery.data} />
          <DashboardCashflowChart height={280} />
          <StatementSideLists statement={statementQuery.data} />
        </Stack>
        <Stack spacing={2.5} className="min-w-0">
          <DashboardEndingInstallments />
          <DashboardInsights period={monthParam} limit={3} />
          <DashboardBudgets referenceDate={referenceDate} />
          <DashboardRecentEntries
            statement={statementQuery.data}
            monthParam={monthParam}
            limit={8}
          />
        </Stack>
      </Box>
    </Stack>
  );
}
