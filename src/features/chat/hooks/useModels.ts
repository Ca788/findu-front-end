'use client';

import { useQuery } from '@tanstack/react-query';
import { listModels } from '@/features/chat/gateway/models.gateway';

export const MODELS_LIST_KEY = 'chat:models';

export function useModels() {
  return useQuery({
    queryKey: [MODELS_LIST_KEY],
    queryFn: listModels,
    staleTime: 5 * 60_000,
  });
}
