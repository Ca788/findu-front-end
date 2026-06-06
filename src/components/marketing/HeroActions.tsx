'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export function HeroActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        component={Link}
        href={AppRoutePaths.LOGIN}
        variant="contained"
        size="large"
        fullWidth
      >
        Entrar
      </Button>
      <Button
        component={Link}
        href={AppRoutePaths.DASHBOARD}
        variant="outlined"
        size="large"
        fullWidth
      >
        Dashboard
      </Button>
    </div>
  );
}
