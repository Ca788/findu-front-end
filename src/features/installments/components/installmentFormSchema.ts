import { z } from 'zod';

export const installmentFormSchema = z.object({
  description: z.string().max(200).optional().or(z.literal('')),
  transaction_type: z.enum(['expense', 'income']),
  monthly_amount: z
    .string()
    .min(1, 'Valor obrigatório')
    .refine((raw) => {
      const numeric = Number(raw.replace(/\./g, '').replace(',', '.'));
      return Number.isFinite(numeric) && numeric > 0;
    }, 'Valor deve ser maior que zero'),
  total_installments: z
    .string()
    .min(1, 'Quantidade obrigatória')
    .refine((v) => Number(v) >= 1, 'Deve ser >= 1'),
  first_competency: z.string().min(1, 'Mês da primeira parcela obrigatório'),
  category_id: z.string().optional().or(z.literal('')),
});

export type InstallmentFormValues = z.infer<typeof installmentFormSchema>;
