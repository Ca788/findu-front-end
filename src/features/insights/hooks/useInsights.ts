import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  listInsights,
  type ListInsightsParams,
} from '@/features/insights/gateway/insights.gateway';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { Insight } from '@/features/insights/models/insight.model';

export const INSIGHTS_LIST_KEY = 'insights:list';

export function useInsights(params: ListInsightsParams) {
  return useAppQuery<PaginatedSuccessResponse<Insight>>({
    queryKey: [INSIGHTS_LIST_KEY, params],
    queryFn: () => listInsights(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
