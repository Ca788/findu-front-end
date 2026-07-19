import { keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  cancelInstallmentPlan,
  createInstallmentPlan,
  listInstallmentPlans,
  updateInstallmentPlan,
  type ListInstallmentPlansParams,
} from '@/features/installments/gateway/installments.gateway';
import { STATEMENT_KEY } from '@/features/statements/hooks/useStatement';
import { STATEMENTS_LIST_KEY } from '@/features/statements/hooks/useStatementsList';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type {
  InstallmentPlan,
  InstallmentPlanInput,
  InstallmentPlanUpdateInput,
} from '@/features/installments/models/installment.model';

export const INSTALLMENT_PLANS_LIST_KEY = 'installment_plans:list';

export function useInstallmentPlans(params: ListInstallmentPlansParams = {}) {
  return useAppQuery<PaginatedSuccessResponse<InstallmentPlan>>({
    queryKey: [INSTALLMENT_PLANS_LIST_KEY, params],
    queryFn: () => listInstallmentPlans(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

function invalidateInstallmentCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: [INSTALLMENT_PLANS_LIST_KEY] });
  queryClient.invalidateQueries({ queryKey: [STATEMENT_KEY] });
  queryClient.invalidateQueries({ queryKey: [STATEMENTS_LIST_KEY] });
}

export function useCreateInstallmentPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InstallmentPlanInput) => createInstallmentPlan(input),
    onSuccess: () => invalidateInstallmentCaches(queryClient),
  });
}

export function useUpdateInstallmentPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; input: InstallmentPlanUpdateInput }) =>
      updateInstallmentPlan(args.id, args.input),
    onSuccess: () => invalidateInstallmentCaches(queryClient),
  });
}

export function useCancelInstallmentPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelInstallmentPlan(id),
    onSuccess: () => invalidateInstallmentCaches(queryClient),
  });
}
