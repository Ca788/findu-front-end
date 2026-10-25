'use client';

import type { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { BoxIllustrationView } from '@/features/boxes/components/BoxIllustrationView';
import type { BoxIllustrationKey } from '@/features/boxes/models/box.model';

interface SummaryHeroProps {
  illustration: BoxIllustrationKey;
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  aside?: ReactNode;
  color?: string;
  animate?: boolean;
}

export function SummaryHero({
  illustration,
  label,
  value,
  caption,
  aside,
  color,
  animate = true,
}: SummaryHeroProps) {
  return (
    <Paper
      variant="outlined"
      className="findu-anim-fade-in-soft"
      sx={(theme) => {
        const accent = color ?? theme.palette.primary.main;
        return {
          p: 2.5,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(accent, 0.16)} 0%, ${alpha(accent, 0.02)} 100%)`,
        };
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
        <BoxIllustrationView illustrationKey={illustration} size={88} animate={animate} />
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            {value}
          </Typography>
          {caption && (
            <Typography variant="body2" color="text.secondary">
              {caption}
            </Typography>
          )}
        </Stack>
        {aside}
      </Stack>
    </Paper>
  );
}
