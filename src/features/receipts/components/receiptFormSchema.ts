import { z } from 'zod';

export const receiptFormSchema = z.object({
  category_id: z.string().min(1, 'Categoria obrigatória'),
  from: z.string().min(1, 'Mês inicial obrigatório'),
  to: z.string().min(1, 'Mês final obrigatório'),
  transaction_type: z.enum(['all', 'expense', 'income']),
  status: z.enum(['pending', 'paid']),
  deliver: z.boolean(),
});

export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;
