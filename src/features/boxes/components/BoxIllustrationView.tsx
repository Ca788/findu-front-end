'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { buildBoxAnimation } from '@/features/boxes/animations/buildBoxAnimation';
import { getBoxIllustration } from '@/features/boxes/constants/boxCatalog';

const Lottie = dynamic(() => import('lottie-react').then((mod) => mod.LottieLight), { ssr: false });

interface BoxIllustrationViewProps {
  illustrationKey: string | null | undefined;
  size?: number;
  animate?: boolean;
  celebrate?: boolean;
}

export function BoxIllustrationView({
  illustrationKey,
  size = 120,
  animate = true,
  celebrate = false,
}: BoxIllustrationViewProps) {
  const illustration = getBoxIllustration(illustrationKey);
  const animationData = useMemo(() => buildBoxAnimation(illustration), [illustration]);

  if (!animate) {
    return (
      <Box
        component="img"
        src={illustration.src}
        alt={illustration.label}
        sx={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
      />
    );
  }

  return (
    <Box
      className={celebrate ? 'findu-box-celebrate' : undefined}
      sx={{ width: size, height: size, display: 'block', '& svg': { display: 'block' } }}
    >
      <Lottie src={animationData} loop autoplay style={{ width: size, height: size }} />
    </Box>
  );
}
