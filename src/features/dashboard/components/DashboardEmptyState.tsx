'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BoxIllustrationView } from '@/features/boxes/components/BoxIllustrationView';
import type { BoxIllustrationKey } from '@/features/boxes/models/box.model';

interface DashboardEmptyStateProps {
  illustration: BoxIllustrationKey;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  size?: number;
  extra?: ReactNode;
  compact?: boolean;
}

export function DashboardEmptyState({
  illustration,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  size = 84,
  extra,
  compact = false,
}: DashboardEmptyStateProps) {
  const action = actionLabel ? (
    actionHref ? (
      <Button component={Link} href={actionHref} size="small" variant="outlined">
        {actionLabel}
      </Button>
    ) : (
      <Button size="small" variant="outlined" onClick={onAction}>
        {actionLabel}
      </Button>
    )
  ) : null;

  if (compact) {
    return (
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
        <BoxIllustrationView illustrationKey={illustration} size={Math.min(size, 56)} />
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
  }

  return (
    <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center', py: 1 }}>
      <BoxIllustrationView illustrationKey={illustration} size={size} />
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
}
