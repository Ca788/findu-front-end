'use client';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { PageHeader } from '@/components/common/PageHeader';
import { useSummary } from '@/features/summary/hooks/useSummary';
import { useSummaryPeriod } from '@/features/summary/hooks/useSummaryPeriod';
import { PeriodPicker } from '@/features/summary/components/PeriodPicker';
import { SummaryKpis } from '@/features/summary/components/SummaryKpis';
import { CategoryBreakdown } from '@/features/summary/components/CategoryBreakdown';

export function SummaryPage() {
  const { preset, range, setPreset, setRange } = useSummaryPeriod();
  const { data, isFetching, isError } = useSummary(range);

  return (
    <Stack spacing={3}>
      <PageHeader eyebrow="Financeiro" title="Resumo" />

      <PeriodPicker
        preset={preset}
        range={range}
        onPresetChange={setPreset}
        onRangeChange={setRange}
      />

      {isError && <Alert severity="error">Erro ao carregar resumo.</Alert>}
      {isFetching && <LinearProgress />}

      <SummaryKpis summary={data} />
      <CategoryBreakdown summary={data} />
    </Stack>
  );
}
