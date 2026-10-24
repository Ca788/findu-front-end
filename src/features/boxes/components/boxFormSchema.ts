import { z } from 'zod';
import { parseAmountInput } from '@/utils/currency';
import { BOX_ILLUSTRATION_KEYS, BOX_KINDS, BOX_MOVEMENT_KINDS } from '@/features/boxes/models/box.model';

const optionalAmountSchema = z
  .string()
  .refine((raw) => !raw || (parseAmountInput(raw) ?? -1) >= 0, 'Valor inválido');

const requiredAmountSchema = z
  .string()
  .min(1, 'Valor obrigatório')
  .refine((raw) => (parseAmountInput(raw) ?? -1) >= 0, 'Valor inválido');

export const boxFormSchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório').max(60, 'Máximo de 60 caracteres'),
  kind: z.enum(BOX_KINDS),
  illustration_key: z.enum(BOX_ILLUSTRATION_KEYS),
  target_amount: optionalAmountSchema,
  initial_balance: optionalAmountSchema,
  notes: z.string().optional(),
});

export type BoxFormValues = z.infer<typeof boxFormSchema>;

export const boxMovementFormSchema = z.object({
  kind: z.enum(BOX_MOVEMENT_KINDS),
  amount: requiredAmountSchema,
  description: z.string().optional(),
});

export type BoxMovementFormValues = z.infer<typeof boxMovementFormSchema>;
