import { useAppQuery } from '@/hooks/useAppQuery';
import { listAgents } from '@/features/chat/gateway/agents.gateway';
import type { Agent } from '@/features/chat/models/agent.model';

export const AGENTS_LIST_KEY = 'chat:agents:list';

export function useAgents() {
  return useAppQuery<Agent[]>({
    queryKey: [AGENTS_LIST_KEY],
    queryFn: () => listAgents(),
    staleTime: 5 * 60_000,
  });
}
