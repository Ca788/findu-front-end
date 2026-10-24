'use client';

import { useCallback, useState } from 'react';
import {
  addMonths,
  currentMonthParam,
  formatMonthLabel,
} from '@/features/statements/utils/month';

type CycleDirection = 'next' | 'prev';

export type DashboardMonth = ReturnType<typeof useDashboardMonth>;

export function useDashboardMonth() {
  const [state, setState] = useState<{ month: string; direction: CycleDirection }>(() => ({
    month: currentMonthParam(),
    direction: 'next',
  }));

  const onPreviousMonth = useCallback(() => {
    setState((current) => ({ month: addMonths(current.month, -1), direction: 'prev' }));
  }, []);

  const onNextMonth = useCallback(() => {
    setState((current) => ({ month: addMonths(current.month, 1), direction: 'next' }));
  }, []);

  const onCurrentMonth = useCallback(() => {
    setState((current) => {
      const today = currentMonthParam();
      if (current.month === today) return current;
      return { month: today, direction: today > current.month ? 'next' : 'prev' };
    });
  }, []);

  const isCurrentMonth = state.month === currentMonthParam();

  return {
    monthParam: state.month,
    direction: state.direction,
    isCurrentMonth,
    referenceDate: `${state.month}-01`,
    monthLabel: formatMonthLabel(state.month),
    onPreviousMonth,
    onNextMonth,
    onCurrentMonth,
  };
}
