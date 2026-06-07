import { useMemo } from 'react';

interface DashboardMonth {
  from: string;
  to: string;
  monthLabel: string;
  referenceDate: string;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function useDashboardMonth(): DashboardMonth {
  return useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthLabel = new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(today);
    return {
      from: toIsoDate(start),
      to: toIsoDate(today),
      referenceDate: toIsoDate(today),
      monthLabel,
    };
  }, []);
}
