export const GOAL_STATUSES = ['active', 'achieved', 'canceled'] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export interface Goal {
  id: string;
  name: string;
  target_amount: string;
  current_amount: string;
  remaining_amount: string;
  progress_percent: number;
  deadline?: string | null;
  status: GoalStatus;
  category_id?: string | null;
  notes?: string | null;
  achieved_at?: string | null;
}

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  active: 'Ativa',
  achieved: 'Concluída',
  canceled: 'Cancelada',
};
