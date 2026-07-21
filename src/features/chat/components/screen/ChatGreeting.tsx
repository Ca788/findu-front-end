'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

export function ChatGreeting() {
  const { user } = useCurrentUser();
  const firstName = (user?.name ?? '').trim().split(/\s+/)[0] || '';

  return (
    <Box
      className="findu-anim-fade-in"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.75,
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'action.hover',
        }}
      >
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 22, color: 'primary.main' }} />
      </Box>

      {firstName ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: 14, letterSpacing: 0.01 }}
        >
          Olá, {firstName}
        </Typography>
      ) : null}

      <Typography
        variant="h4"
        component="h2"
        sx={{
          m: 0,
          fontWeight: 560,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          fontSize: { xs: '1.45rem', sm: '1.7rem' },
          color: 'text.primary',
          maxWidth: 280,
        }}
      >
        Como posso ajudar?
      </Typography>
    </Box>
  );
}
