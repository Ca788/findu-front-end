'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

const PHASES = [
  'Processando sua mensagem…',
  'Preparando a melhor resposta…',
  'Organizando os detalhes…',
  'Quase lá…',
];

interface ThinkingStatusProps {
  urgent?: boolean;
}

export function ThinkingStatus({ urgent = false }: ThinkingStatusProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const intervalMs = urgent ? 2200 : 2800;
    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % PHASES.length);
        setVisible(true);
      }, 220);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [urgent]);

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-label={PHASES[index]}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        py: 0.5,
        px: 0.25,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'action.hover',
          animation: 'fu-think-pulse 1.6s ease-in-out infinite',
          '@keyframes fu-think-pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.85 },
            '50%': { transform: 'scale(1.08)', opacity: 1 },
          },
        }}
      >
        <AutoAwesomeOutlinedIcon
          sx={{
            fontSize: 16,
            color: 'primary.main',
            animation: 'fu-spark 2.4s ease-in-out infinite',
            '@keyframes fu-spark': {
              '0%, 100%': { transform: 'rotate(0deg)' },
              '50%': { transform: 'rotate(18deg)' },
            },
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontSize: 14.5,
          fontWeight: 500,
          color: 'text.secondary',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 220ms ease, transform 220ms ease',
        }}
      >
        {PHASES[index]}
      </Typography>
    </Box>
  );
}
