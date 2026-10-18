import { z } from 'zod';

const amountSchema = z
  .string()
  .min(1, 'Valor obrigatório')
  .refine((raw) => {
    const numeric = Number(raw.replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(numeric) && numeric > 0;
  }, 'Valor deve ser maior que zero');

const optionalAmountSchema = z.string().refine((raw) => {
  if (!raw) return true;
  const numeric = Number(raw.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(numeric) && numeric >= 0;
}, 'Valor inválido');

export const investmentFormSchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório'),
  asset_type: z.enum([
    'fixed_income',
    'stocks',
    'funds',
    'treasury',
    'crypto',
    'other',
  ]),
  institution: z.string().optional(),
  invested_amount: amountSchema,
  current_amount: optionalAmountSchema,
  invested_on: z.string().min(1, 'Data obrigatória'),
  status: z.enum(['active', 'redeemed']),
  notes: z.string().optional(),
});

export type InvestmentFormValues = z.infer<typeof investmentFormSchema>;
