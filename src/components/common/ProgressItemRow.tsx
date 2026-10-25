'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

export type ProgressTone = 'neutral' | 'good' | 'warn' | 'bad' | 'income';

const TONE: Record<ProgressTone, string> = {
  neutral: '#2F6BFF',
  good: '#1B8A5A',
  warn: '#D97706',
  bad: '#D64545',
  income: '#1B8A5A',
};

interface ProgressRingProps {
  value: number;
  color: string;
}

export function ProgressRing({ value, color }: ProgressRingProps) {
  const pct = Math.min(100, Math.max(0, value));
  const r = 15;
  const c = 2 * Math.PI * r;

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        flexShrink: 0,
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 40 40"
        sx={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
      >
        <circle cx="20" cy="20" r={r} fill="none" stroke={alpha(color, 0.16)} strokeWidth="3.5" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
        />
      </Box>
      <Typography sx={{ fontSize: 10, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color }}>
        {Math.round(pct)}
      </Typography>
    </Box>
  );
}

interface DayBadgeProps {
  day: number;
  color: string;
}

export function DayBadge({ day, color }: DayBadgeProps) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        flexShrink: 0,
        borderRadius: '12px',
        bgcolor: alpha(color, 0.12),
        color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
      }}
    >
      <Typography sx={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.4, opacity: 0.72 }}>
        DIA
      </Typography>
      <Typography sx={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
        {day}
      </Typography>
    </Box>
  );
}

interface ProgressItemRowProps {
  title: string;
  subtitle: string;
  value: string;
  progress: number;
  tone?: ProgressTone;
  badge?: string;
  href?: string;
  leading?: 'ring' | 'day';
  day?: number;
}

export function ProgressItemRow({
  title,
  subtitle,
  value,
  progress,
  tone = 'neutral',
  badge,
  href,
  leading = 'ring',
  day,
}: ProgressItemRowProps) {
  const color = TONE[tone];
  const content = (
    <>
      {leading === 'day' && day ? (
        <DayBadge day={day} color={color} />
      ) : (
        <ProgressRing value={progress} color={color} />
      )}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums', flexShrink: 0, color }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mt: 0.15,
          }}
        >
          <Typography variant="caption" color="text.secondary" noWrap>
            {subtitle}
          </Typography>
          {badge ? (
            <Typography
              variant="caption"
              sx={{
                flexShrink: 0,
                fontWeight: 700,
                color,
                bgcolor: alpha(color, 0.1),
                px: 0.75,
                py: 0.1,
                borderRadius: 999,
              }}
            >
              {badge}
            </Typography>
          ) : null}
        </Box>
        <Box
          sx={{
            mt: 0.75,
            height: 5,
            borderRadius: 999,
            bgcolor: alpha(color, 0.14),
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              height: '100%',
              bgcolor: color,
              borderRadius: 999,
              transition: 'width 700ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </Box>
      </Box>
    </>
  );

  const rowSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    minWidth: 0,
    py: 0.25,
  } as const;

  if (href) {
    return (
      <Box
        component={Link}
        href={href}
        sx={{
          ...rowSx,
          color: 'inherit',
          textDecoration: 'none',
          borderRadius: 2,
          '&:hover': { bgcolor: alpha(color, 0.06) },
        }}
      >
        {content}
      </Box>
    );
  }

  return <Box sx={rowSx}>{content}</Box>;
}

interface ProgressListCardProps {
  title: string;
  href?: string;
  actionLabel?: string;
  children: ReactNode;
}

export function ProgressListCard({
  title,
  href,
  actionLabel = 'Ver',
  children,
}: ProgressListCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderRadius: '14px',
        px: 2,
        py: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</Typography>
        {href ? (
          <Typography
            component={Link}
            href={href}
            variant="caption"
            sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'none' }}
          >
            {actionLabel}
          </Typography>
        ) : null}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0 }}>{children}</Box>
    </Paper>
  );
}
