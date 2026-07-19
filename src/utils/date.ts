const DATE_BR = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });
const DATE_TIME_BR = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});
const TIME_BR = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' });

export function formatDateBR(iso: string | null | undefined): string {
  if (!iso) return '—';
  // Date-only strings are treated as local civil dates.
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split('-').map(Number);
    return DATE_BR.format(new Date(y, m - 1, d));
  }
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

/** Persists a date-only input as noon UTC to avoid timezone day shifts. */
export function toIsoDate(localDate: string | null | undefined): string | null {
  if (!localDate) return null;
  return `${localDate}T12:00:00Z`;
}

/** Today's local civil date as "YYYY-MM-DD". */
export function localTodayInput(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toLocalDateInput(iso: string | null | undefined): string {
  if (!iso) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
