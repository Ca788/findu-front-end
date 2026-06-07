export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageKind = 'text' | 'audio';
export type MessageStatus = 'pending' | 'processing' | 'completed' | 'failed';

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
  created_at: string;
  updated_at: string;
}

export interface SendMessageInput {
  body: string;
  client_message_id?: string;
}
