import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { SuccessResponse } from '@/infrastructure/AppResponse';
import type { Agent } from '@/features/chat/models/agent.model';

const BASE_PATH = '/chat/agents';

export async function listAgents(): Promise<Agent[]> {
  const response = await authorizedApiClient.get<SuccessResponse<Agent[]>>(BASE_PATH);
  return response.data.data ?? [];
}
