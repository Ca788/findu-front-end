'use client';

import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';
import { getBoxIllustration } from '@/features/boxes/constants/boxCatalog';
import type { Box } from '@/features/boxes/models/box.model';

interface BoxProgressBarProps {
  box: Box;
  height?: number;
}

export function boxAccent(box: Pick<Box, 'color' | 'illustration_key'>): string {
  return box.color || getBoxIllustration(box.illustration_key).color;
}

export function boxProgress(box: Pick<Box, 'target_amount' | 'progress_percent'>) {
  const hasTarget = box.target_amount != null && Number(box.target_amount) > 0;
  const percent = Math.max(0, Math.min(100, box.progress_percent ?? 0));
  return { hasTarget, percent, completed: hasTarget && percent >= 100 };
}

export function BoxProgressBar({ box, height = 8 }: BoxProgressBarProps) {
  const accent = boxAccent(box);
  const { percent } = boxProgress(box);

  return (
    <LinearProgress
      variant="determinate"
      value={percent}
      sx={{
        height,
        borderRadius: 999,
        bgcolor: alpha(accent, 0.18),
        '& .MuiLinearProgress-bar': {
          bgcolor: accent,
          borderRadius: 999,
          transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        },
      }}
    />
  );
}
