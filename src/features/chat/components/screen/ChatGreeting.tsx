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
        gap: 1.5,
        textAlign: 'center',
        px: 2,
        width: '100%',
        maxWidth: 520,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 26 }} />
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
          fontWeight: 620,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          fontSize: { xs: '1.45rem', sm: '1.7rem' },
          color: 'text.primary',
          maxWidth: 280,
        }}
      >
        Como posso ajudar?
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
        Escolha uma sugestão ou envie uma mensagem
      </Typography>
    </Box>
  );
}
