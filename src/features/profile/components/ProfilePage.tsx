'use client';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { PageHeader } from '@/components/common/PageHeader';
import { ProfileForm } from '@/features/profile/components/ProfileForm';

export function ProfilePage() {
  return (
    <Stack spacing={3}>
      <PageHeader eyebrow="Conta" title="Meu perfil" />
      <Paper className="rounded-2xl px-4 py-5 md:px-8 md:py-7">
        <ProfileForm />
      </Paper>
    </Stack>
  );
}
