'use client';

import { ReactNode } from 'react';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

interface AuthFormShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthFormShell({ title, description, children }: AuthFormShellProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
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
          height: '48%',
          objectFit: 'cover',
          objectPosition: 'center top',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(11,18,32,0.35) 0%, rgba(11,18,32,0.75) 38%, #0B1220 58%)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          px: 2.5,
          pt: 'calc(1rem + var(--app-safe-top, 0px))',
          pb: 'calc(1.5rem + var(--app-safe-bottom, 0px))',
          maxWidth: 440,
          width: '100%',
          mx: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3 }}>
          <IconButton
            component={NextLink}
            href={AppRoutePaths.ROOT}
            aria-label="Voltar"
            sx={{ color: '#fff' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontSize: 22,
            }}
          >
            Findu
          </Typography>
        </Box>

        <Typography
          component="h1"
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem' },
            letterSpacing: '-0.02em',
            mb: 0.75,
          }}
        >
          {title}
        </Typography>
        {description ? (
          <Typography sx={{ color: 'rgba(255,255,255,0.72)', mb: 3, fontSize: 15 }}>
            {description}
          </Typography>
        ) : (
          <Box sx={{ mb: 3 }} />
        )}

        <Box
          sx={{
            mt: 'auto',
            bgcolor: 'background.paper',
            borderRadius: '28px 28px 0 0',
            px: { xs: 2.5, sm: 3 },
            py: 3,
            flex: 1,
            boxShadow: '0 -12px 40px rgba(0,0,0,0.25)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
