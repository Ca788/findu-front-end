export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageKind = 'text' | 'audio';
export type MessageStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface MessageAttachment {
  id: number | string;
  filename: string;
  content_type: string;
  byte_size: number;
  url: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  parent_message_id: string | null;
  role: MessageRole;
  kind: MessageKind;
  body: string | null;
  status: MessageStatus;
  intent: string | null;
  payload?: Record<string, unknown> | null;
  error?: Record<string, unknown> | null;
  audio_url?: string | null;
  attachments?: MessageAttachment[];
  created_at: string;
  updated_at: string;
}

export interface SendMessageInput {
  body?: string;
  attachments?: File[];
  audio?: Blob;
  audioFilename?: string;
  client_message_id?: string;
}
