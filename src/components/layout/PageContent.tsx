'use client';

import { ReactNode, useCallback, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useQueryClient } from '@tanstack/react-query';

interface PageContentProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onRefresh?: () => Promise<unknown> | unknown;
}

const MAX_WIDTH_CLASS: Record<NonNullable<PageContentProps['maxWidth']>, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const PULL_THRESHOLD = 72;

export function PageContent({
  children,
  className = '',
  maxWidth = 'lg',
  onRefresh,
}: PageContentProps) {
  const queryClient = useQueryClient();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const runRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        await queryClient.invalidateQueries();
      }
    } finally {
      setRefreshing(false);
      setPull(0);
    }
  }, [onRefresh, queryClient]);

  return (
    <div
      ref={scrollerRef}
      className={`flex-1 min-h-0 overflow-y-auto findu-scroll-smooth ${className}`}
      onTouchStart={(event) => {
        if (refreshing) return;
        const scroller = scrollerRef.current;
        if (!scroller || scroller.scrollTop > 0) {
          startYRef.current = null;
          return;
        }
        startYRef.current = event.touches[0]?.clientY ?? null;
      }}
      onTouchMove={(event) => {
        if (refreshing || startYRef.current == null) return;
        const scroller = scrollerRef.current;
        if (!scroller || scroller.scrollTop > 0) return;
        const currentY = event.touches[0]?.clientY ?? startYRef.current;
        const delta = Math.max(0, currentY - startYRef.current);
        if (delta > 0) {
          setPull(Math.min(delta * 0.45, 96));
        }
      }}
      onTouchEnd={() => {
        if (refreshing) return;
        if (pull >= PULL_THRESHOLD) {
          void runRefresh();
        } else {
          setPull(0);
        }
        startYRef.current = null;
      }}
    >
      <Box
        sx={{
          height: pull || refreshing ? Math.max(pull, refreshing ? 48 : 0) : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: refreshing || pull === 0 ? 'height 160ms ease' : 'none',
          color: 'primary.main',
        }}
      >
        {(pull > 12 || refreshing) && (
          <CircularProgress size={22} thickness={5} />
        )}
      </Box>

      <div
        className={`mx-auto w-full ${MAX_WIDTH_CLASS[maxWidth]} px-4 pt-4 sm:px-5 sm:pt-5 md:px-8 md:pt-8`}
        style={{
          paddingBottom: 'calc(1.5rem + var(--app-bottom-nav-space, var(--app-safe-bottom)))',
        }}
      >
        {children}
      </div>
    </div>
  );
}
