'use client';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import type { PeriodPreset } from '@/features/summary/hooks/useSummaryPeriod';

interface PeriodRange {
  from: string;
  to: string;
}

interface PeriodPickerProps {
  preset: PeriodPreset;
  range: PeriodRange;
  onPresetChange: (preset: PeriodPreset) => void;
  onRangeChange: (range: PeriodRange) => void;
}

const PRESETS: { value: PeriodPreset; label: string }[] = [
  { value: 'this_month', label: 'Este mês' },
  { value: 'last_month', label: 'Mês passado' },
  { value: 'last_30_days', label: 'Últimos 30 dias' },
  { value: 'custom', label: 'Personalizado' },
];

export function PeriodPicker({
  preset,
  range,
  onPresetChange,
  onRangeChange,
}: PeriodPickerProps) {
  const isCustom = preset === 'custom';

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
      <TextField
        select
        label="Período"
        size="small"
        value={preset}
        onChange={(e) => onPresetChange(e.target.value as PeriodPreset)}
        className="col-span-2 sm:col-auto min-w-[180px]"
      >
        {PRESETS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {isCustom && (
        <>
          <TextField
            label="De"
            type="date"
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            value={range.from}
            onChange={(e) => onRangeChange({ ...range, from: e.target.value })}
          />
          <TextField
            label="Até"
            type="date"
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            value={range.to}
            onChange={(e) => onRangeChange({ ...range, to: e.target.value })}
          />
        </>
      )}
    </div>
  );
}
