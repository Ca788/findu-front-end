import { keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  cancelRecurrence,
  createRecurrence,
  listRecurrences,
  updateRecurrence,
  type ListRecurrencesParams,
} from '@/features/recurrences/gateway/recurrences.gateway';
import { STATEMENT_KEY } from '@/features/statements/hooks/useStatement';
import { STATEMENTS_LIST_KEY } from '@/features/statements/hooks/useStatementsList';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type {
  RecurrenceRule,
  RecurrenceRuleInput,
} from '@/features/recurrences/models/recurrence.model';

export const RECURRENCES_LIST_KEY = 'recurrences:list';

export function useRecurrences(params: ListRecurrencesParams = {}) {
  return useAppQuery<PaginatedSuccessResponse<RecurrenceRule>>({
    queryKey: [RECURRENCES_LIST_KEY, params],
    queryFn: () => listRecurrences(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

function invalidateRecurrenceCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: [RECURRENCES_LIST_KEY] });
  queryClient.invalidateQueries({ queryKey: [STATEMENT_KEY] });
  queryClient.invalidateQueries({ queryKey: [STATEMENTS_LIST_KEY] });
}

export function useCreateRecurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RecurrenceRuleInput) => createRecurrence(input),
    onSuccess: () => invalidateRecurrenceCaches(queryClient),
  });
}

export function useUpdateRecurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; input: RecurrenceRuleInput }) =>
      updateRecurrence(args.id, args.input),
    onSuccess: () => invalidateRecurrenceCaches(queryClient),
  });
}

export function useCancelRecurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelRecurrence(id),
    onSuccess: () => invalidateRecurrenceCaches(queryClient),
  });
}
