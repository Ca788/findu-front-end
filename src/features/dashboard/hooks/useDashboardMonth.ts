'use client';

import { useCallback, useState } from 'react';
import {
  addMonths,
  currentMonthParam,
  formatMonthLabel,
} from '@/features/statements/utils/month';

export function useDashboardMonth() {
  const [monthParam, setMonthParam] = useState(currentMonthParam);

  const onPreviousMonth = useCallback(() => {
    setMonthParam((current) => addMonths(current, -1));
  }, []);

  const onNextMonth = useCallback(() => {
    setMonthParam((current) => addMonths(current, 1));
  }, []);

  return {
    monthParam,
    referenceDate: `${monthParam}-01`,
    monthLabel: formatMonthLabel(monthParam),
    onPreviousMonth,
    onNextMonth,
  };
}
