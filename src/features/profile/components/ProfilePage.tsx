'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { mobileMoreNavItems } from '@/components/layout/app-shell/appNavItems';
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

      {isMobile && (
        <div className="grid grid-cols-2 gap-2.5">
          {mobileMoreNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Paper
                key={item.href}
                component={Link}
                href={item.href}
                className="flex flex-col items-start gap-2.5 rounded-3xl px-3.5 py-3.5 no-underline"
                sx={{ color: 'inherit', minHeight: 104 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2.5,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'action.hover',
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.25,
                    width: '100%',
                    wordBreak: 'break-word',
                  }}
                >
                  {item.label}
                </Typography>
              </Paper>
            );
          })}
        </div>
      )}

      <Paper className="rounded-3xl px-4 py-5 md:px-8 md:py-7">
        <ProfileForm />
      </Paper>
    </Stack>
  );
}
