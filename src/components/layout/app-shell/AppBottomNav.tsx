'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { mobileTabNavItems } from '@/components/layout/app-shell/appNavItems';
import { APP_BOTTOM_NAV_HEIGHT } from '@/components/layout/app-shell/constants';
import { useDevice } from '@/hooks/useDevice';

export function AppBottomNav() {
  const pathname = usePathname() ?? '';
  const { isMobile } = useDevice();

  if (!isMobile) return null;

  return (
    <Box
      component="nav"
      aria-label="Navegação principal"
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        minHeight: APP_BOTTOM_NAV_HEIGHT,
        px: 0.5,
        pt: 0.5,
        pb: 'calc(6px + var(--app-safe-bottom))',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        backgroundImage:
          'linear-gradient(to top, var(--mui-palette-background-default), color-mix(in srgb, var(--mui-palette-background-default) 92%, transparent))',
        backdropFilter: 'blur(12px)',
        zIndex: 20,
      }}
    >
      {mobileTabNavItems.map((item) => {
        const active = item.isActive(pathname);
        const Icon = item.icon;

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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.25,
              py: 0.5,
              px: 0.25,
              borderRadius: 2,
              textDecoration: 'none',
              color: active ? 'primary.main' : 'text.secondary',
              transition: 'color 120ms ease, background-color 120ms ease',
              WebkitTapHighlightColor: 'transparent',
              '&:active': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 28,
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                bgcolor: active ? 'action.selected' : 'transparent',
                transition: 'background-color 120ms ease',
              }}
            >
              <Icon
                sx={{
                  fontSize: 22,
                  color: 'inherit',
                }}
              />
            </Box>
            <Typography
              component="span"
              sx={{
                fontSize: 10.5,
                lineHeight: 1.1,
                fontWeight: active ? 600 : 500,
                letterSpacing: 0.1,
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
