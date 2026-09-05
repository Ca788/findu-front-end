'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useInsights } from '@/features/insights/hooks/useInsights';
import {
  INSIGHT_SEVERITY_LABELS,
  type InsightSeverity,
} from '@/features/insights/models/insight.model';

interface DashboardInsightsProps {
  period: string;
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

export function DashboardInsights({ period }: DashboardInsightsProps) {
  const { data, isLoading, isError } = useInsights({
    page: 1,
    perPage: 5,
    period,
    view: 'default',
  });

  const insights = data?.data ?? [];

  return (
    <Paper className="flex min-w-0 flex-col gap-3.5 rounded-xl px-4 py-4">
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        Insights
      </Typography>

      {isError && (
        <Typography variant="body2" color="error.main">
          Erro ao carregar insights.
        </Typography>
      )}

      {isLoading && (
        <LinearProgress variant="indeterminate" sx={{ borderRadius: 999, height: 3 }} />
      )}

      {!isLoading && !isError && insights.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhum insight gerado para este mês ainda.
        </Typography>
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
    </Paper>
  );
}
