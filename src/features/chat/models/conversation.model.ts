import type { AgentId } from '@/features/chat/models/agent.model';

export interface Conversation {
  id: string;
  title: string | null;
  archived_at: string | null;
  agent_id: AgentId | null;
  model_id: string | null;
  messages_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationInput {
  title?: string;
  agent_id?: AgentId | null;
  model_id?: string | null;
}
