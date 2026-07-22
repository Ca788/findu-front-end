'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CreditScoreIcon from '@mui/icons-material/CreditScoreOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

const ACTIONS = [
  {
    href: AppRoutePaths.STATEMENTS,
    label: 'Extrato',
    icon: ReceiptLongIcon,
  },
  {
    href: AppRoutePaths.CHAT,
    label: 'Chat',
    icon: AutoAwesomeIcon,
  },
  {
    href: AppRoutePaths.INSTALLMENTS,
    label: 'Parcelas',
    icon: CreditScoreIcon,
  },
] as const;

export function DashboardQuickActions() {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 1.25 }}
      >
        Pro dia a dia
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 1.25,
        }}
      >
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Box
              key={action.href}
              component={Link}
              href={action.href}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.75,
                textDecoration: 'none',
                color: 'text.primary',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  maxWidth: 88,
                  borderRadius: 3,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(47,111,224,0.16)'
                      : 'rgba(30,79,150,0.08)',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 180ms ease, background-color 180ms ease',
                  '&:active': { transform: 'scale(0.96)' },
                }}
              >
                <Icon sx={{ fontSize: 28, color: 'primary.main' }} />
              </Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: 'text.secondary' }}
              >
                {action.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
