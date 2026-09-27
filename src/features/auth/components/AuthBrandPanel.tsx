'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function AuthBrandPanel() {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1,
        position: 'relative',
        alignItems: 'flex-end',
        minHeight: '100dvh',
        overflow: 'hidden',
        p: 6,
      }}
    >
      <Box
        component="img"
        src="/auth/hero.jpg"
        alt=""
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(11,18,32,0.2) 0%, rgba(11,18,32,0.55) 48%, rgba(11,18,32,0.92) 100%)',
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            fontSize: '3.25rem',
            lineHeight: 0.95,
            mb: 1.5,
          }}
        >
          Findu
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.84)', fontSize: 18, lineHeight: 1.45 }}>
          Suas finanças com clareza e um assistente que realmente ajuda.
        </Typography>
      </Box>
    </Box>
  );
}
