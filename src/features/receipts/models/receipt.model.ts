export type ReceiptStatus = 'pending' | 'sent' | 'failed';
export type SerializerView = 'default' | 'extended';

export interface Receipt {
  id: string;
  category_id?: string | null;
  payer_name: string | null;
  payer_phone: string;
  period_start: string;
  period_end: string;
  total_amount: string;
  status: ReceiptStatus;
  sent_at?: string | null;
  filename?: string;
  file_attached?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface ReceiptInput {
  category_id: string;
  from?: string | null;
  to?: string | null;
  transaction_type?: 'expense' | 'income' | null;
  status?: 'pending' | 'paid' | null;
  deliver?: boolean;
}

export interface ReceiptListFilters {
  payer_phone?: string;
  status?: ReceiptStatus;
  view?: SerializerView;
}

export const RECEIPT_STATUS_LABELS: Record<ReceiptStatus, string> = {
  pending: 'Na fila',
  sent: 'Enviado',
  failed: 'Falhou',
};
