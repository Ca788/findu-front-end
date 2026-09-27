import { z } from 'zod';
import { optionalPhoneSchema } from '@/utils/maskedInput';

const MAX_AVATAR_MB = 5;
const AVATAR_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;

const avatarSchema = z
  .custom<File>((value) => value instanceof File, 'Arquivo inválido')
  .superRefine((file, ctx) => {
    if (!AVATAR_ALLOWED_TYPES.includes(file.type as (typeof AVATAR_ALLOWED_TYPES)[number])) {
      ctx.addIssue({
        code: 'custom',
        message: 'Use PNG, JPEG ou WEBP',
      });
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      ctx.addIssue({
        code: 'custom',
        message: `Imagem deve ter no máximo ${MAX_AVATAR_MB}MB`,
      });
    }
  })
  .optional()
  .nullable();

export const profileFormSchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório').max(120, 'Máximo 120 caracteres'),
  phone: optionalPhoneSchema,
  avatar: avatarSchema,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
