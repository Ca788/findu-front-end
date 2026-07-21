'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { mobileTabNavItems } from '@/components/layout/app-shell/appNavItems';
import {
  APP_BOTTOM_NAV_FLOAT_GAP,
  APP_BOTTOM_NAV_HEIGHT,
} from '@/components/layout/app-shell/constants';
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';
import { useDevice } from '@/hooks/useDevice';

export function AppBottomNav() {
  const pathname = usePathname() ?? '';
  const { isMobile } = useDevice();
  const { keyboardOpen } = useAppShell();

  if (!isMobile || keyboardOpen) return null;

  return (
    <Box
      component="nav"
      aria-label="Navegação principal"
      sx={{
        position: 'absolute',
        left: APP_BOTTOM_NAV_FLOAT_GAP,
        right: APP_BOTTOM_NAV_FLOAT_GAP,
        bottom: `calc(${APP_BOTTOM_NAV_FLOAT_GAP}px + var(--app-safe-bottom))`,
        zIndex: 30,
        height: APP_BOTTOM_NAV_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 0.25,
        px: 1,
        borderRadius: 999,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {mobileTabNavItems.map((item) => {
        const active = item.isActive(pathname);
        const Icon = item.icon;

        if (item.featured) {
          return (
            <Box
              key={item.href}
              component={Link}
              href={item.href}
              aria-label="Chat Findu"
              aria-current={active ? 'page' : undefined}
              className="findu-ai-orb"
              sx={{
                width: 58,
                height: 58,
                mt: '-22px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                textDecoration: 'none',
                color: 'primary.contrastText',
                bgcolor: 'primary.main',
                flexShrink: 0,
                WebkitTapHighlightColor: 'transparent',
                boxShadow: (theme) =>
                  `0 0 0 4px ${theme.palette.background.default}, 0 8px 28px ${theme.palette.primary.main}66`,
              }}
            >
              <Icon sx={{ fontSize: 26 }} />
            </Box>
          );
        }

        return (
          <Box
            key={item.href}
            component={Link}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            sx={{
              flex: 1,
              minWidth: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.2,
              borderRadius: 999,
              textDecoration: 'none',
              color: active ? 'text.primary' : 'text.secondary',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Box
              sx={{
                px: 1.25,
                py: 0.35,
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                bgcolor: active ? 'action.selected' : 'transparent',
              }}
            >
              <Icon sx={{ fontSize: 22, color: 'inherit' }} />
            </Box>
            <Typography
              component="span"
              sx={{
                fontSize: 10,
                lineHeight: 1.1,
                fontWeight: active ? 700 : 500,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
