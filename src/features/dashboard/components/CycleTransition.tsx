'use client';

import type { CSSProperties, ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { DashboardMonth } from '@/features/dashboard/hooks/useDashboardMonth';

interface CycleTransitionProps {
  cycle: Pick<DashboardMonth, 'monthParam' | 'direction'>;
  children: ReactNode;
  fill?: boolean;
}

export function CycleTransition({ cycle, children, fill = false }: CycleTransitionProps) {
  const animation = cycle.direction === 'next' ? 'findu-anim-cycle-next' : 'findu-anim-cycle-prev';
  return (
    <Box key={cycle.monthParam} className={animation} sx={{ minWidth: 0, height: fill ? '100%' : undefined }}>
      {children}
    </Box>
  );
}

export function riseDelay(index: number, step = 60): CSSProperties {
  return { '--findu-delay': `${index * step}ms` } as CSSProperties;
}
