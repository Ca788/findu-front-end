import { z } from 'zod';

export const entryFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Valor obrigatório')
    .refine((raw) => {
      const numeric = Number(raw.replace(/\./g, '').replace(',', '.'));
      return Number.isFinite(numeric) && numeric > 0;
    }, 'Valor deve ser maior que zero'),
  transaction_type: z.enum(['expense', 'income']),
  status: z.enum(['pending', 'paid']),
  description: z.string().max(200, 'Máximo de 200 caracteres').optional().or(z.literal('')),
  occurred_at: z.string().optional().or(z.literal('')),
  category_id: z.string().optional().or(z.literal('')),
  category_name: z.string().max(60, 'Máximo de 60 caracteres').optional().or(z.literal('')),
  payer_name: z.string().max(120, 'Máximo de 120 caracteres').optional().or(z.literal('')),
  payer_phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((raw) => {
      if (!raw) return true;
      return raw.replace(/\D/g, '').length >= 8;
    }, 'Informe um WhatsApp válido'),
});

export type EntryFormValues = z.infer<typeof entryFormSchema>;
