export const BOX_KINDS = ['emergency', 'goal', 'spending', 'recurring_expenses', 'custom'] as const;
export type BoxKind = (typeof BOX_KINDS)[number];

export const BOX_ILLUSTRATION_KEYS = [
  'piggy',
  'shield',
  'house',
  'plane',
  'car',
  'gift',
  'heart',
  'coins',
  'rocket',
  'umbrella',
  'briefcase',
  'graduation',
] as const;
export type BoxIllustrationKey = (typeof BOX_ILLUSTRATION_KEYS)[number];

export const BOX_MOVEMENT_KINDS = ['deposit', 'withdraw', 'adjustment'] as const;
export type BoxMovementKind = (typeof BOX_MOVEMENT_KINDS)[number];

type BoxMovementSource = 'manual' | 'allocation' | 'chat';

export interface Box {
  id: string;
  name: string;
  kind: BoxKind;
  illustration_key: BoxIllustrationKey;
  color?: string | null;
  target_amount?: string | null;
  balance: string;
  position: number;
  remaining_amount?: string | null;
  progress_percent?: number | null;
  archived: boolean;
  notes?: string | null;
  archived_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BoxInput {
  name: string;
  kind: BoxKind;
  illustration_key: BoxIllustrationKey;
  color?: string;
  target_amount?: number | null;
  notes?: string;
  initial_balance?: number;
}

export interface BoxMovement {
  id: string;
  box_id: string;
  kind: BoxMovementKind;
  source: BoxMovementSource;
  amount: string;
  balance_after: string;
  description?: string | null;
  occurred_at: string;
  transaction_id?: string | null;
  created_at?: string;
}

export interface BoxMovementInput {
  kind: BoxMovementKind;
  amount: number;
  description?: string;
}

export interface BoxMoveResult {
  box: Box;
  movement: BoxMovement;
}

export const BOX_KIND_LABELS: Record<BoxKind, string> = {
  emergency: 'Reserva de emergência',
  goal: 'Objetivo',
  spending: 'Uso pessoal',
  recurring_expenses: 'Despesas recorrentes',
  custom: 'Personalizada',
};

export const BOX_MOVEMENT_LABELS: Record<BoxMovementKind, string> = {
  deposit: 'Depósito',
  withdraw: 'Retirada',
  adjustment: 'Ajuste de saldo',
};
