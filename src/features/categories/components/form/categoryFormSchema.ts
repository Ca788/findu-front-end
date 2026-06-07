import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome obrigatório')
    .max(60, 'Máximo de 60 caracteres'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
