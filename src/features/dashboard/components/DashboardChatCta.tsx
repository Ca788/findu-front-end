'use client';

import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export function DashboardChatCta() {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: 4,
      }}
      className="flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-6"
    >
      <div className="flex items-start gap-3">
        <div>
          <Typography variant="subtitle1" className="font-semibold">
            Pergunte ao Findu
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Tire dúvidas sobre suas finanças, registre uma despesa por áudio
            ou peça um resumo do mês.
          </Typography>
        </div>
      </div>
      <Button
        component={Link}
        href={AppRoutePaths.CHAT}
        variant="contained"
        color="inherit"
        sx={{
          color: 'primary.main',
          bgcolor: 'primary.contrastText',
          '&:hover': { bgcolor: 'primary.contrastText', opacity: 0.92 },
          alignSelf: 'flex-start',
        }}
      >
        Abrir chat
      </Button>
    </Paper>
  );
}
