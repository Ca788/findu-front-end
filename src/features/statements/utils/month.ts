const MONTH_LABEL = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

const SHORT_MONTH = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
});

/**
 * Accepts "YYYY-MM", "YYYY-MM-DD", or Date. Returns a Date at day 01 UTC.
 */
export function parseMonth(value: string | Date): Date {
  if (value instanceof Date) return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1));
  const [yearRaw, monthRaw] = value.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  return new Date(Date.UTC(year, month - 1, 1));
}

/** "YYYY-MM" */
export function formatMonthParam(value: Date | string): string {
  const date = value instanceof Date ? value : parseMonth(value);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/** "Julho de 2026" */
export function formatMonthLabel(value: Date | string): string {
  const label = MONTH_LABEL.format(parseMonth(value));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** "jul 2026" */
export function formatMonthShort(value: Date | string): string {
  return SHORT_MONTH.format(parseMonth(value)).replace('.', '').toLowerCase();
}

export function currentMonthParam(): string {
  return formatMonthParam(new Date());
}

export function addMonths(value: Date | string, delta: number): string {
  const date = parseMonth(value);
  return formatMonthParam(
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + delta, 1)),
  );
}
