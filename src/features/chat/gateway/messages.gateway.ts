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

function defaultAudioFilename(blob: Blob): string {
  const mime = blob.type || 'audio/webm';
  const ext = mime.includes('mp4')
    ? 'm4a'
    : mime.includes('ogg')
      ? 'ogg'
      : mime.includes('mpeg')
        ? 'mp3'
        : mime.includes('wav')
          ? 'wav'
          : 'webm';
  return `audio-${Date.now()}.${ext}`;
}

export async function sendMessage(
  conversationId: string,
  input: SendMessageInput,
): Promise<ChatMessage> {
  const hasFiles = !!input.attachments && input.attachments.length > 0;
  const hasAudio = !!input.audio;

  if (!hasFiles && !hasAudio) {
    const response = await authorizedApiClient.post<SuccessResponse<ChatMessage>>(
      messagesPath(conversationId),
      { body: input.body, client_message_id: input.client_message_id },
    );
    return response.data.data;
  }

  const formData = new FormData();
  if (input.body) formData.append('body', input.body);
  if (input.client_message_id) formData.append('client_message_id', input.client_message_id);
  input.attachments?.forEach((file) => formData.append('attachments[]', file));
  if (input.audio) {
    const filename = input.audioFilename ?? defaultAudioFilename(input.audio);
    formData.append('audio', input.audio, filename);
  }

  const response = await authorizedApiClient.post<SuccessResponse<ChatMessage>>(
    messagesPath(conversationId),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.data;
}
