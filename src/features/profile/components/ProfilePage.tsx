'use client';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { useDevice } from '@/hooks/useDevice';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

export function ProfilePage() {
  const { isMobile } = useDevice();
  const { user } = useCurrentUser();
  const firstName = (user?.name ?? '').split(' ')[0] || 'você';

  return (
    <Stack spacing={2.5}>
      {isMobile ? (
        <Stack spacing={0.25}>
          <Typography variant="body2" color="text.secondary">
            Conta
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.03em',
              fontSize: '1.65rem',
              lineHeight: 1.15,
            }}
          >
            Olá, {firstName}
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={0.5}>
          <Typography variant="overline" color="text.secondary">
            Conta
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Meu perfil
          </Typography>
        </Stack>
      )}

      <Paper className="rounded-xl px-4 py-5 md:px-8 md:py-7">
        <ProfileForm />
      </Paper>
    </Stack>
  );
}
