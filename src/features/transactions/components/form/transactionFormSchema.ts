import { z } from 'zod';

export const transactionFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Valor obrigatório')
    .refine((raw) => {
      const numeric = Number(raw.replace(/\./g, '').replace(',', '.'));
      return Number.isFinite(numeric) && numeric > 0;
    }, 'Valor deve ser maior que zero'),
  transaction_type: z.enum(['expense', 'income']),
  description: z.string().max(200, 'Máximo de 200 caracteres').optional().or(z.literal('')),
  occurred_at: z.string().optional().or(z.literal('')),
  category_id: z.string().optional().or(z.literal('')),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
