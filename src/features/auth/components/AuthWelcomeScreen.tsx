'use client';

import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export function AuthWelcomeScreen() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        bgcolor: '#0B1220',
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
            'linear-gradient(180deg, rgba(11,18,32,0.15) 0%, rgba(11,18,32,0.45) 42%, rgba(11,18,32,0.92) 78%, #0B1220 100%)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          px: 3,
          pt: 4,
          pb: 'calc(2rem + var(--app-safe-bottom, 0px))',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          maxWidth: 480,
          width: '100%',
          mx: 'auto',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '3.4rem', sm: '4rem' },
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: '#fff',
          }}
        >
          Findu
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.82)',
            fontSize: 17,
            lineHeight: 1.45,
            maxWidth: 320,
          }}
        >
          Suas finanças com clareza — e um assistente que realmente ajuda.
        </Typography>

        <StackButtons />
      </Box>
    </Box>
  );
}

function StackButtons() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mt: 1 }}>
      <Button
        component={NextLink}
        href={AppRoutePaths.REGISTER}
        variant="contained"
        size="large"
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: 999,
          fontWeight: 700,
          fontSize: 16,
          textTransform: 'none',
          bgcolor: '#2F6FE0',
          '&:hover': { bgcolor: '#2560C7' },
        }}
      >
        Cadastre-se
      </Button>
      <Button
        component={NextLink}
        href={AppRoutePaths.LOGIN}
        variant="outlined"
        size="large"
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: 999,
          fontWeight: 700,
          fontSize: 16,
          textTransform: 'none',
          color: '#fff',
          borderColor: 'rgba(255,255,255,0.55)',
          '&:hover': {
            borderColor: '#fff',
            bgcolor: 'rgba(255,255,255,0.08)',
          },
        }}
      >
        Entre
      </Button>
    </Box>
  );
}
