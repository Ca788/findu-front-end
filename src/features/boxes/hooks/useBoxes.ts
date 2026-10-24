import { keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  archiveBox,
  createBox,
  listBoxMovements,
  listBoxes,
  moveBoxFunds,
  updateBox,
  type ListBoxMovementsParams,
  type ListBoxesParams,
} from '@/features/boxes/gateway/boxes.gateway';
import type {
  Box,
  BoxInput,
  BoxMovement,
  BoxMovementInput,
} from '@/features/boxes/models/box.model';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';

const BOXES_LIST_KEY = 'boxes:list';
const BOX_MOVEMENTS_KEY = 'boxes:movements';

export function useBoxes(params: ListBoxesParams) {
  return useAppQuery<PaginatedSuccessResponse<Box>>({
    queryKey: [BOXES_LIST_KEY, params],
    queryFn: () => listBoxes(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useBoxMovements(boxId: string | undefined, params: ListBoxMovementsParams) {
  return useAppQuery<PaginatedSuccessResponse<BoxMovement>>({
    queryKey: [BOX_MOVEMENTS_KEY, boxId, params],
    queryFn: () => listBoxMovements(boxId as string, params),
    enabled: Boolean(boxId),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

function useInvalidateBoxes() {
  const queryClient = useQueryClient();
  return useCallback(
    (boxId?: string) => {
      queryClient.invalidateQueries({ queryKey: [BOXES_LIST_KEY] });
      if (boxId) {
        queryClient.invalidateQueries({ queryKey: [BOX_MOVEMENTS_KEY, boxId] });
      }
    },
    [queryClient],
  );
}

export function useCreateBox() {
  const invalidate = useInvalidateBoxes();
  return useMutation({
    mutationFn: (input: BoxInput) => createBox(input),
    onSuccess: () => invalidate(),
  });
}

export function useUpdateBox() {
  const invalidate = useInvalidateBoxes();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BoxInput }) => updateBox(id, input),
    onSuccess: () => invalidate(),
  });
}

export function useArchiveBox() {
  const invalidate = useInvalidateBoxes();
  return useMutation({
    mutationFn: ({ id, restore }: { id: string; restore?: boolean }) => archiveBox(id, restore),
    onSuccess: () => invalidate(),
  });
}

export function useMoveBoxFunds() {
  const invalidate = useInvalidateBoxes();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BoxMovementInput }) => moveBoxFunds(id, input),
    onSuccess: (_result, variables) => invalidate(variables.id),
  });
}

type DialogMode = 'closed' | 'form' | 'move' | 'detail' | 'archive';

export function useBoxDialogs() {
  const [mode, setMode] = useState<DialogMode>('closed');
  const [selected, setSelected] = useState<Box | undefined>();

  const open = useCallback((next: Exclude<DialogMode, 'closed'>, box?: Box) => {
    setSelected(box);
    setMode(next);
  }, []);
  const close = useCallback(() => {
    setMode('closed');
    setSelected(undefined);
  }, []);

  return {
    selected,
    mode,
    openCreate: () => open('form'),
    openEdit: (box: Box) => open('form', box),
    openMove: (box: Box) => open('move', box),
    openDetail: (box: Box) => open('detail', box),
    openArchive: (box: Box) => open('archive', box),
    close,
  };
}
