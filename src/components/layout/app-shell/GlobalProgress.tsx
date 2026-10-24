'use client';

import LinearProgress from '@mui/material/LinearProgress';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

const SHOW_DELAY_MS = 300;

export function GlobalProgress() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  if (fetching + mutating === 0) return null;

  return (
    <LinearProgress
      aria-label="Carregando"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: (theme) => theme.zIndex.appBar + 1,
        pointerEvents: 'none',
        animation: `findu-fade-in 120ms ease ${SHOW_DELAY_MS}ms both`,
      }}
    />
  );
}
