export function getInitials(name?: string | null, fallback?: string | null): string {
  const source = (name ?? '').trim() || (fallback ?? '').trim();
  if (!source) return '?';

  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
