export type InsightSeverity = 'info' | 'warning' | 'critical';
export type SerializerView = 'default' | 'extended';

export interface Insight {
  id: string;
  content: string;
  severity: InsightSeverity | null;
  reference_type: string;
  reference_id?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface InsightListFilters {
  reference_type?: string;
  severity?: InsightSeverity;
  period?: string;
  view?: SerializerView;
}

export const INSIGHT_SEVERITY_LABELS: Record<InsightSeverity, string> = {
  info: 'Info',
  warning: 'Atenção',
  critical: 'Urgente',
};
