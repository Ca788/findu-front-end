import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import { getSummary } from '@/features/summary/gateway/summary.gateway';
import type { Summary, SummaryFilters } from '@/features/summary/models/summary.model';

export const SUMMARY_KEY = 'summary';

export function useSummary(filters: SummaryFilters) {
  return useAppQuery<Summary>({
    queryKey: [SUMMARY_KEY, filters],
    queryFn: () => getSummary(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
