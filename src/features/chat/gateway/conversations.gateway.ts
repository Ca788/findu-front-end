import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type {
  Conversation,
  ConversationInput,
} from '@/features/chat/models/conversation.model';

const BASE_PATH = '/chat/conversations';

export interface ListConversationsParams {
  page?: number;
  perPage?: number;
}

export async function listConversations(
  params?: ListConversationsParams,
): Promise<PaginatedSuccessResponse<Conversation>> {
  const response = await authorizedApiClient.get<
    PaginatedSuccessResponse<Conversation>
  >(BASE_PATH, {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 20,
    },
  });
  return response.data;
}

export async function getConversation(id: string): Promise<Conversation> {
  const response = await authorizedApiClient.get<SuccessResponse<Conversation>>(
    `${BASE_PATH}/${id}`,
  );
  return response.data.data;
}

export async function createConversation(
  input: ConversationInput,
): Promise<Conversation> {
  const response = await authorizedApiClient.post<SuccessResponse<Conversation>>(
    BASE_PATH,
    input,
  );
  return response.data.data;
}

export async function archiveConversation(id: string): Promise<void> {
  await authorizedApiClient.delete(`${BASE_PATH}/${id}`);
}
