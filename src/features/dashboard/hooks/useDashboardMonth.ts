'use client';

import { useMemo } from 'react';
import {
  currentMonthParam,
  formatMonthLabel,
} from '@/features/statements/utils/month';
import { localTodayInput } from '@/utils/date';

export function useDashboardMonth() {
  return useMemo(() => {
    const monthParam = currentMonthParam();
    const referenceDate = localTodayInput();
    const monthLabel = formatMonthLabel(monthParam);

    return { monthParam, referenceDate, monthLabel };
  }, []);
}
