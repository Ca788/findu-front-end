import { useMemo } from 'react';
import {
  currentMonthParam,
  formatMonthLabel,
} from '@/features/statements/utils/month';

interface DashboardMonth {
  monthParam: string; // "YYYY-MM"
  monthLabel: string;
  referenceDate: string; // "YYYY-MM-DD" (hoje)
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function useDashboardMonth(): DashboardMonth {
  return useMemo(() => {
    const monthParam = currentMonthParam();
    return {
      monthParam,
      monthLabel: formatMonthLabel(monthParam),
      referenceDate: toIsoDate(new Date()),
    };
  }, []);
}
