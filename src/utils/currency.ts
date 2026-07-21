const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatBRL(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(numeric)) return '—';
  return BRL.format(numeric);
}

export function parseAmountInput(raw: string): number | null {
  if (!raw) return null;
  const normalized = raw.replace(/\./g, '').replace(',', '.');
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

export function formatMoneyDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 15);
  if (!digits) return '';

  const padded = digits.padStart(3, '0');
  const cents = padded.slice(-2);
  const integer = padded.slice(0, -2).replace(/^0+(?=\d)/, '') || '0';
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${grouped},${cents}`;
}

export function formatAmountForInput(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === '') return '';

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (/^\d{1,3}(\.\d{3})*,\d{2}$/.test(trimmed)) return trimmed;
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      const asNumber = Number(trimmed);
      if (!Number.isFinite(asNumber)) return '';
      return formatMoneyDigits(String(Math.round(asNumber * 100)));
    }
    const parsed = parseAmountInput(trimmed);
    if (parsed == null) return '';
    return formatMoneyDigits(String(Math.round(parsed * 100)));
  }

  if (!Number.isFinite(value)) return '';
  return formatMoneyDigits(String(Math.round(value * 100)));
}
