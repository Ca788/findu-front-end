import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function maskEmail(value: string): string {
  return value.replace(/\s/g, '').toLowerCase();
}

export function phoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length > 11) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 11);
}

export function maskBrPhone(value: string): string {
  const digits = phoneDigits(value);
  if (digits.length === 0) return '';
  if (digits.length < 3) return `(${digits}`;
  const area = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (digits.length < 7) return `(${area}) ${rest}`;
  if (digits.length < 11) {
    return `(${area}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  return `(${area}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export const requiredEmailSchema = z
  .string()
  .trim()
  .min(1, 'E-mail obrigatório')
  .refine((value) => EMAIL_PATTERN.test(value), 'E-mail inválido');

export const optionalPhoneSchema = z.string().trim().refine((value) => {
  if (!value) return true;
  const count = phoneDigits(value).length;
  return count === 10 || count === 11;
}, 'Telefone inválido');
