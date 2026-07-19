const MONTH_LABEL = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

const SHORT_MONTH = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
});

/** Parses "YYYY-MM", "YYYY-MM-DD", or Date as a local calendar month (day 1). */
export function parseMonth(value: string | Date): Date {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), 1);
  }

  const [yearRaw, monthRaw] = value.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  return new Date(year, month - 1, 1);
}

/** Formats as "YYYY-MM" in the local calendar. */
export function formatMonthParam(value: Date | string): string {
  const date = value instanceof Date ? parseMonth(value) : parseMonth(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/** Formats as "Julho de 2026". */
export function formatMonthLabel(value: Date | string): string {
  const label = MONTH_LABEL.format(parseMonth(value));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Formats as "jul 2026". */
export function formatMonthShort(value: Date | string): string {
  return SHORT_MONTH.format(parseMonth(value)).replace('.', '').toLowerCase();
}

/** Current local calendar month as "YYYY-MM". */
export function currentMonthParam(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function addMonths(value: Date | string, delta: number): string {
  const date = parseMonth(value);
  return formatMonthParam(new Date(date.getFullYear(), date.getMonth() + delta, 1));
}
