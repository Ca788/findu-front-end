'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BoxIllustrationView } from '@/features/boxes/components/BoxIllustrationView';
import type { BoxIllustrationKey } from '@/features/boxes/models/box.model';

type EmptyStateVariant = 'inline' | 'compact' | 'card';

interface EmptyStateProps {
  illustration: BoxIllustrationKey;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  size?: number;
  extra?: ReactNode;
  variant?: EmptyStateVariant;
}

export function EmptyState({
  illustration,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  size,
  extra,
  variant = 'inline',
}: EmptyStateProps) {
  const card = variant === 'card';
  const illustrationSize = size ?? (card ? 140 : 84);
  const buttonVariant = card ? 'contained' : 'outlined';
  const buttonSize = card ? 'medium' : 'small';

  const action = actionLabel ? (
    actionHref ? (
      <Button component={Link} href={actionHref} size={buttonSize} variant={buttonVariant}>
        {actionLabel}
      </Button>
    ) : (
      <Button size={buttonSize} variant={buttonVariant} onClick={onAction}>
        {actionLabel}
      </Button>
    )
  ) : null;

  switch (variant) {
    case 'compact':
      return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
          <BoxIllustrationView illustrationKey={illustration} size={Math.min(illustrationSize, 56)} />
          <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {description && (
              <Typography variant="caption" color="text.secondary">
                {description}
              </Typography>
            )}
            {action && <Stack direction="row" sx={{ pt: 0.5 }}>{action}</Stack>}
            {extra}
          </Stack>
        </Stack>
      );
    case 'card':
      return (
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
            <BoxIllustrationView illustrationKey={illustration} size={illustrationSize} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
                {description}
              </Typography>
            )}
            {action}
            {extra}
          </Stack>
        </Paper>
      );
    case 'inline':
      return (
        <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', py: 1 }}>
          <BoxIllustrationView illustrationKey={illustration} size={illustrationSize} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 260 }}>
              {description}
            </Typography>
          )}
          {action}
          {extra}
        </Stack>
      );
    default: {
      const exhaustive: never = variant;
      return exhaustive;
    }
  }
}
