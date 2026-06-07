import { z } from 'zod';

export const budgetFormSchema = z
  .object({
    period_type: z.enum(['weekly', 'monthly', 'yearly', 'custom']),
    period_start: z.string().min(1, 'Início obrigatório'),
    period_end: z.string().min(1, 'Fim obrigatório'),
    limit_amount: z
      .string()
      .min(1, 'Valor obrigatório')
      .refine((raw) => {
        const numeric = Number(raw.replace(/\./g, '').replace(',', '.'));
        return Number.isFinite(numeric) && numeric > 0;
      }, 'Valor deve ser maior que zero'),
  })
  .refine(
    (data) => new Date(data.period_end).getTime() > new Date(data.period_start).getTime(),
    { path: ['period_end'], message: 'Fim deve ser depois do início' },
  );

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
