'use client';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { useDashboardMonth } from '@/features/dashboard/hooks/useDashboardMonth';
import { DashboardWelcome } from '@/features/dashboard/components/DashboardWelcome';
import { DashboardBudgets } from '@/features/dashboard/components/DashboardBudgets';
import { DashboardRecentEntries } from '@/features/dashboard/components/DashboardRecentEntries';
import { useStatement } from '@/features/statements/hooks/useStatement';
import { StatementKpis } from '@/features/statements/components/StatementKpis';
import { StatementSideLists } from '@/features/statements/components/StatementSideLists';

export function DashboardPage() {
  const { monthParam, referenceDate, monthLabel } = useDashboardMonth();
  const statementQuery = useStatement(monthParam);

  return (
    <Stack spacing={3}>
      <DashboardWelcome monthLabel={monthLabel} />

      {statementQuery.isError && (
        <Alert severity="error">Erro ao carregar extrato do mês.</Alert>
      )}
      {statementQuery.isFetching && <LinearProgress />}

      <StatementKpis statement={statementQuery.data} />

      <div className="grid gap-3 lg:grid-cols-2">
        <DashboardBudgets referenceDate={referenceDate} />
        <DashboardRecentEntries statement={statementQuery.data} monthParam={monthParam} />
      </div>

      <StatementSideLists statement={statementQuery.data} />
    </Stack>
  );
}
