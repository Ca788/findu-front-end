'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useDashboardMonth } from '@/features/dashboard/hooks/useDashboardMonth';
import { DashboardWelcome } from '@/features/dashboard/components/DashboardWelcome';
import { DashboardQuickActions } from '@/features/dashboard/components/DashboardQuickActions';
import { DashboardBudgets } from '@/features/dashboard/components/DashboardBudgets';
import { DashboardBoxes } from '@/features/dashboard/components/DashboardBoxes';
import { DashboardCashflowChart } from '@/features/dashboard/components/DashboardCashflowChart';
import { CycleTransition } from '@/features/dashboard/components/CycleTransition';
import { useStatement } from '@/features/statements/hooks/useStatement';
import {
  AccountBalanceHero,
  AccountBalanceMetrics,
  useHiddenBalance,
} from '@/features/statements/components/AccountBalanceCard';
import { StatementSideLists } from '@/features/statements/components/StatementSideLists';
import { DashboardInsights } from '@/features/insights/components/DashboardInsights';

const GAP = 2.5;

export function DashboardDesktopHome() {
  const cycle = useDashboardMonth();
  const statementQuery = useStatement(cycle.monthParam);
  const loading = statementQuery.isFetching && !statementQuery.data;
  const { hidden, toggleHidden } = useHiddenBalance();

  return (
    <Stack spacing={GAP} className="min-w-0">
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3 }}>
        <DashboardWelcome cycle={cycle} />
        <DashboardQuickActions monthParam={cycle.monthParam} variant="buttons" />
      </Box>

      {statementQuery.isError && (
        <Alert severity="error" sx={{ borderRadius: '14px' }}>
          Erro ao carregar extrato do mês.
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: GAP,
          alignItems: 'stretch',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gridTemplateRows: 'auto auto minmax(0, 1fr)',
          '& > *': { minWidth: 0, minHeight: 0 },
        }}
      >
        <DashboardBoxes />
        <CycleTransition cycle={cycle} fill>
          <AccountBalanceHero
            statement={statementQuery.data}
            loading={loading}
            hidden={hidden}
            onToggleHidden={toggleHidden}
          />
        </CycleTransition>

        <CycleTransition cycle={cycle} fill>
          <AccountBalanceMetrics statement={statementQuery.data} loading={loading} hidden={hidden} />
        </CycleTransition>
        <CycleTransition cycle={cycle} fill>
          <DashboardInsights period={cycle.monthParam} limit={2} />
        </CycleTransition>

        <CycleTransition cycle={cycle} fill>
          <DashboardCashflowChart height={260} monthParam={cycle.monthParam} />
        </CycleTransition>
        <CycleTransition cycle={cycle} fill>
          <DashboardBudgets referenceDate={cycle.referenceDate} />
        </CycleTransition>
      </Box>

      <CycleTransition cycle={cycle}>
        <Box
          sx={{
            '& > div': {
              display: 'grid',
              gap: GAP,
              alignItems: 'stretch',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            },
            '& > div > .MuiPaper-root': { height: '100%', borderRadius: '14px', minWidth: 0 },
          }}
        >
          <StatementSideLists statement={statementQuery.data} compact />
        </Box>
      </CycleTransition>
    </Stack>
  );
}
