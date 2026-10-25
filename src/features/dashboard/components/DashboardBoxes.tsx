'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { BoxIllustrationView } from '@/features/boxes/components/BoxIllustrationView';
import { BoxProgressBar, boxAccent, boxProgress } from '@/features/boxes/components/BoxProgressBar';
import type { Box as BoxModel } from '@/features/boxes/models/box.model';
import { AnimatedMoney } from '@/features/dashboard/components/AnimatedMoney';
import { DashboardCard } from '@/features/dashboard/components/DashboardCard';
import { EmptyState } from '@/components/common/EmptyState';
import { riseDelay } from '@/features/dashboard/components/CycleTransition';

interface DashboardBoxesProps {
  limit?: number;
}

function BoxRow({ box, index }: { box: BoxModel; index: number }) {
  const accent = boxAccent(box);
  const { hasTarget } = boxProgress(box);

  return (
    <Box
      component={Link}
      href={AppRoutePaths.BOXES}
      className="findu-anim-rise"
      style={riseDelay(index)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        minWidth: 0,
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: 3,
        p: 1,
        mx: -1,
        transition: 'background-color 160ms ease',
        '&:hover': { bgcolor: alpha(accent, 0.08) },
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          flexShrink: 0,
          borderRadius: '50%',
          bgcolor: alpha(accent, 0.16),
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <BoxIllustrationView illustrationKey={box.illustration_key} size={46} animate={index === 0} />
      </Box>
      <Stack spacing={0.4} sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, minWidth: 0 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {box.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: accent, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}
          >
            <AnimatedMoney value={Number(box.balance)} />
          </Typography>
        </Box>
        {hasTarget ? (
          <BoxProgressBar box={box} height={6} />
        ) : (
          <Typography variant="caption" color="text.secondary">
            Sem meta definida
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export function DashboardBoxes({ limit = 3 }: DashboardBoxesProps) {
  const { data, isLoading, isError } = useBoxes({ page: 1, perPage: 24 });
  const boxes = useMemo(() => data?.data ?? [], [data]);
  const total = useMemo(() => boxes.reduce((sum, item) => sum + Number(item.balance), 0), [boxes]);
  const visible = boxes.slice(0, limit);

  return (
    <DashboardCard
      className="findu-anim-rise"
      title="Caixinhas"
      subtitle={
        boxes.length > 0 ? (
          <>
            <AnimatedMoney value={total} /> guardados em {boxes.length}{' '}
            {boxes.length === 1 ? 'caixinha' : 'caixinhas'}
          </>
        ) : undefined
      }
      action={
        <Button component={Link} href={AppRoutePaths.BOXES} size="small" variant="text">
          Ver todas
        </Button>
      }
    >
      {isError && (
        <Typography variant="body2" color="error.main">
          Erro ao carregar caixinhas.
        </Typography>
      )}

      {isLoading && (
        <Stack spacing={1.5}>
          {Array.from({ length: limit }, (_, index) => (
            <Skeleton key={index} variant="rounded" height={52} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      )}

      {!isLoading && !isError && boxes.length === 0 && (
        <EmptyState
          illustration="piggy"
          title="Comece a guardar"
          description="Crie caixinhas para a reserva, uma viagem ou qualquer objetivo."
          actionLabel="Criar caixinha"
          actionHref={AppRoutePaths.BOXES}
          variant="compact"
        />
      )}

      {visible.length > 0 && (
        <Stack spacing={0.5}>
          {visible.map((box, index) => (
            <BoxRow key={box.id} box={box} index={index} />
          ))}
        </Stack>
      )}
    </DashboardCard>
  );
}
