import { keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  createInvestment,
  deleteInvestment,
  listInvestments,
  updateInvestment,
  type ListInvestmentsParams,
} from '@/features/investments/gateway/investments.gateway';
import type {
  Investment,
  InvestmentInput,
} from '@/features/investments/models/investment.model';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';

export const INVESTMENTS_LIST_KEY = 'investments:list';

export function useInvestments(params: ListInvestmentsParams) {
  return useAppQuery<PaginatedSuccessResponse<Investment>>({
    queryKey: [INVESTMENTS_LIST_KEY, params],
    queryFn: () => listInvestments(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InvestmentInput) => createInvestment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVESTMENTS_LIST_KEY] });
    },
  });
}

export function useUpdateInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: InvestmentInput }) =>
      updateInvestment(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVESTMENTS_LIST_KEY] });
    },
  });
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvestment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVESTMENTS_LIST_KEY] });
    },
  });
}

type DialogMode = 'closed' | 'form' | 'delete';

export function useInvestmentDialogs() {
  const [mode, setMode] = useState<DialogMode>('closed');
  const [selected, setSelected] = useState<Investment | undefined>();

  const openCreate = useCallback(() => {
    setSelected(undefined);
    setMode('form');
  }, []);
  const openEdit = useCallback((investment: Investment) => {
    setSelected(investment);
    setMode('form');
  }, []);
  const openDelete = useCallback((investment: Investment) => {
    setSelected(investment);
    setMode('delete');
  }, []);
  const close = useCallback(() => {
    setMode('closed');
    setSelected(undefined);
  }, []);

  return {
    selected,
    isFormOpen: mode === 'form',
    isDeleteOpen: mode === 'delete',
    openCreate,
    openEdit,
    openDelete,
    close,
  };
}
