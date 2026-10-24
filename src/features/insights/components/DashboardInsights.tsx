'use client';

import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { DashboardCard } from '@/features/dashboard/components/DashboardCard';
import { DashboardEmptyState } from '@/features/dashboard/components/DashboardEmptyState';
import { useInsights } from '@/features/insights/hooks/useInsights';
import {
  INSIGHT_SEVERITY_LABELS,
  type InsightSeverity,
} from '@/features/insights/models/insight.model';

interface DashboardInsightsProps {
  period: string;
  limit?: number;
}

function severityColor(
  severity: InsightSeverity | null,
): 'default' | 'warning' | 'error' {
  switch (severity) {
    case 'warning':
      return 'warning';
    case 'critical':
      return 'error';
    case 'info':
    case null:
      return 'default';
    default: {
      const _exhaustive: never = severity;
      return _exhaustive;
    }
  }
}

export function DashboardInsights({ period, limit = 3 }: DashboardInsightsProps) {
  const { data, isLoading, isError } = useInsights({
    page: 1,
    perPage: limit,
    period,
    view: 'default',
  });

  const insights = data?.data ?? [];

  return (
    <DashboardCard className="findu-anim-rise" title="Insights">
      {isError && (
        <Typography variant="body2" color="error.main">
          Erro ao carregar insights.
        </Typography>
      )}

      {isLoading && (
        <LinearProgress variant="indeterminate" sx={{ borderRadius: 999, height: 3 }} />
      )}

      {!isLoading && !isError && insights.length === 0 && (
        <DashboardEmptyState
          illustration="graduation"
          title="Nenhum insight neste ciclo"
          description="Conforme você lança movimentações, o Findu gera observações aqui."
          compact
        />
      )}

      {insights.length > 0 && (
        <Stack spacing={2}>
          {insights.map((insight) => (
            <Stack key={insight.id} spacing={0.75} className="min-w-0">
              {insight.severity && (
                <Chip
                  size="small"
                  variant="outlined"
                  color={severityColor(insight.severity)}
                  label={INSIGHT_SEVERITY_LABELS[insight.severity]}
                  sx={{ alignSelf: 'flex-start' }}
                />
              )}
              <Typography variant="body2">{insight.content}</Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </DashboardCard>
  );
}
