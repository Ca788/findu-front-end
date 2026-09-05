import { z } from 'zod';

export const receiptFormSchema = z.object({
  payer_phone: z
    .string()
    .min(1, 'WhatsApp obrigatório')
    .refine((raw) => raw.replace(/\D/g, '').length >= 8, 'Informe um WhatsApp válido'),
  payer_name: z.string().max(120, 'Máximo de 120 caracteres').optional().or(z.literal('')),
  from: z.string().min(1, 'Mês inicial obrigatório'),
  to: z.string().min(1, 'Mês final obrigatório'),
  transaction_type: z.enum(['all', 'expense', 'income']),
  status: z.enum(['all', 'pending', 'paid']),
  deliver: z.boolean(),
});

export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;
