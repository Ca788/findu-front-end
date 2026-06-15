export type AgentId = 'default' | 'analyst' | 'launcher' | 'cleaner';

export interface Agent {
  id: AgentId;
  name: string;
  persona_extension: string | null;
  tool_count: number;
  tool_names: string[];
}
