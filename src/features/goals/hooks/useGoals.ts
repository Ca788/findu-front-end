import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import { listGoals, type ListGoalsParams } from '@/features/goals/gateway/goals.gateway';
import type { Goal } from '@/features/goals/models/goal.model';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';

export const GOALS_LIST_KEY = 'goals:list';

export function useGoals(params: ListGoalsParams) {
  return useAppQuery<PaginatedSuccessResponse<Goal>>({
    queryKey: [GOALS_LIST_KEY, params],
    queryFn: () => listGoals(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
