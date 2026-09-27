'use client';

import { ReactNode } from 'react';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthBrandPanel } from '@/features/auth/components/AuthBrandPanel';
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
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: '#0B1220',
      }}
    >
      <AuthBrandPanel />
      <Box
        sx={{
          position: 'relative',
          flex: { xs: '1 1 auto', md: '0 0 560px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { md: 'center' },
          minHeight: '100dvh',
          overflow: 'hidden',
        }}
      >
      <Box
        component="img"
        src="/auth/hero.jpg"
        alt=""
        sx={{
          display: { md: 'none' },
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
          display: { md: 'none' },
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
          px: { xs: 2.5, md: 5 },
          pt: { xs: 'calc(1rem + var(--app-safe-top, 0px))', md: 4 },
          pb: { xs: 'calc(1.5rem + var(--app-safe-bottom, 0px))', md: 4 },
          maxWidth: 440,
          width: '100%',
          mx: 'auto',
          flex: { xs: 1, md: '0 0 auto' },
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
            mt: { xs: 'auto', md: 0 },
            bgcolor: 'background.paper',
            borderRadius: { xs: '28px 28px 0 0', md: '28px' },
            px: { xs: 2.5, sm: 3 },
            py: 3,
            flex: { xs: 1, md: '0 0 auto' },
            boxShadow: '0 -12px 40px rgba(0,0,0,0.25)',
          }}
        >
          {children}
        </Box>
      </Box>
      </Box>
    </Box>
  );
}
