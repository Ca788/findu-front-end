export interface Conversation {
  id: string;
  title: string | null;
  archived_at: string | null;
  messages_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationInput {
  title?: string;
}
