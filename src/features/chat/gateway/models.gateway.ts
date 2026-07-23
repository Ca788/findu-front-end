import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { SuccessResponse } from '@/infrastructure/AppResponse';
import type { LlmModel } from '@/features/chat/models/llm-model.model';

const BASE_PATH = '/chat/models';

export async function listModels(): Promise<LlmModel[]> {
  const response = await authorizedApiClient.get<SuccessResponse<LlmModel[]>>(BASE_PATH);
  return response.data.data ?? [];
}
