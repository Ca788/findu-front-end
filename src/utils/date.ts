const DATE_BR = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });
const DATE_TIME_BR = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});
const TIME_BR = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' });

export function formatDateBR(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return DATE_BR.format(date);
}

export function formatDateTimeBR(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return DATE_TIME_BR.format(date);
}

export function formatTimeBR(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return TIME_BR.format(date);
}

export function toIsoDate(localDate: string | null | undefined): string | null {
  if (!localDate) return null;
  return `${localDate}T12:00:00Z`;
}

export function toLocalDateInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}
