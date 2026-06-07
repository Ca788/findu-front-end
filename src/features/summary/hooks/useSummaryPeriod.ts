import { useCallback, useMemo, useState } from 'react';

export type PeriodPreset = 'this_month' | 'last_month' | 'last_30_days' | 'custom';

interface PeriodRange {
  from: string;
  to: string;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function presetRange(preset: Exclude<PeriodPreset, 'custom'>): PeriodRange {
  const today = new Date();
  if (preset === 'this_month') {
    return { from: toIsoDate(startOfMonth(today)), to: toIsoDate(today) };
  }
  if (preset === 'last_month') {
    const previous = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return { from: toIsoDate(startOfMonth(previous)), to: toIsoDate(endOfMonth(previous)) };
  }
  const start = new Date(today);
  start.setDate(start.getDate() - 29);
  return { from: toIsoDate(start), to: toIsoDate(today) };
}

export function useSummaryPeriod() {
  const [preset, setPresetState] = useState<PeriodPreset>('this_month');
  const [customRange, setCustomRange] = useState<PeriodRange>(() =>
    presetRange('this_month'),
  );

  const range = useMemo<PeriodRange>(
    () => (preset === 'custom' ? customRange : presetRange(preset)),
    [preset, customRange],
  );

  const setPreset = useCallback((next: PeriodPreset) => {
    setPresetState(next);
    if (next !== 'custom') setCustomRange(presetRange(next));
  }, []);

  const setRange = useCallback((next: PeriodRange) => {
    setCustomRange(next);
    setPresetState('custom');
  }, []);

  return { preset, range, setPreset, setRange };
}
