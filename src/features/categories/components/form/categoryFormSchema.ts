import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome obrigatório')
    .max(60, 'Máximo de 60 caracteres'),
  whatsapp: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((raw) => {
      if (!raw) return true;
      return raw.replace(/\D/g, '').length >= 8;
    }, 'Informe um WhatsApp válido'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
