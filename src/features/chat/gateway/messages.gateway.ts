import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type {
  ChatMessage,
  SendMessageInput,
} from '@/features/chat/models/message.model';

function messagesPath(conversationId: string): string {
  return `/chat/conversations/${conversationId}/messages`;
}

export interface ListMessagesParams {
  page?: number;
  perPage?: number;
}

export async function listMessages(
  conversationId: string,
  params?: ListMessagesParams,
): Promise<PaginatedSuccessResponse<ChatMessage>> {
  const response = await authorizedApiClient.get<
    PaginatedSuccessResponse<ChatMessage>
  >(messagesPath(conversationId), {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 50,
    },
  });
  return response.data;
}

export async function sendMessage(
  conversationId: string,
  input: SendMessageInput,
): Promise<ChatMessage> {
  const response = await authorizedApiClient.post<SuccessResponse<ChatMessage>>(
    messagesPath(conversationId),
    input,
  );
  return response.data.data;
}
