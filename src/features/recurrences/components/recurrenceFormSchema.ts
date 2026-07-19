import { z } from 'zod';

export const recurrenceFormSchema = z.object({
  transaction_type: z.enum(['expense', 'income']),
  amount: z
    .string()
    .min(1, 'Valor obrigatório')
    .refine((raw) => {
      const numeric = Number(raw.replace(/\./g, '').replace(',', '.'));
      return Number.isFinite(numeric) && numeric > 0;
    }, 'Valor deve ser maior que zero'),
  description: z.string().max(200).optional().or(z.literal('')),
  day_of_month: z
    .string()
    .optional()
    .refine((v) => !v || (Number(v) >= 1 && Number(v) <= 31), 'Dia deve estar entre 1 e 31'),
  starts_on: z.string().min(1, 'Data de início obrigatória'),
  ends_on: z.string().optional().or(z.literal('')),
  category_id: z.string().optional().or(z.literal('')),
});

export type RecurrenceFormValues = z.infer<typeof recurrenceFormSchema>;
