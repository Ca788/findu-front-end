export const NOTIFICATION_GROUPS = [
  'entries_due',
  'budgets',
  'insights',
  'installments',
  'reminders',
] as const;
export type NotificationGroup = (typeof NOTIFICATION_GROUPS)[number];

export const NOTIFICATION_CHANNELS = ['in_app', 'push'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export type NotificationKind =
  | 'entry_due_soon'
  | 'entry_due_today'
  | 'entry_overdue'
  | 'budget_warning'
  | 'budget_exceeded'
  | 'insights_ready'
  | 'installment_completed'
  | 'installment_ending'
  | 'idle_reminder'
  | 'daily_register';

export interface NotificationData {
  route?: string;
  month?: string;
  transaction_id?: string;
  budget_id?: string;
  installment_plan_id?: string;
}

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  group: NotificationGroup;
  title: string;
  body: string | null;
  data: NotificationData;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

export type NotificationPreferences = Record<
  NotificationGroup,
  Record<NotificationChannel, boolean>
>;

export const NOTIFICATION_GROUP_LABELS: Record<
  NotificationGroup,
  { label: string; description: string }
> = {
  entries_due: {
    label: 'Contas a vencer',
    description: 'Aviso 3 dias antes, no dia e quando atrasar.',
  },
  budgets: {
    label: 'Orçamento',
    description: 'Quando passar de 80% e quando estourar o limite.',
  },
  insights: {
    label: 'Insights',
    description: 'Quando a análise do mês ficar pronta.',
  },
  installments: {
    label: 'Parcelamentos',
    description: 'Quando restam poucas parcelas e quando um parcelamento é quitado.',
  },
  reminders: {
    label: 'Lembretes',
    description: 'Todo dia às 8h e ao meio-dia para registrar o dia, e um toque semanal se você ficar sem lançar.',
  },
};

export const NOTIFICATION_CHANNEL_LABELS: Record<NotificationChannel, string> = {
  in_app: 'No app',
  push: 'Push no celular',
};
