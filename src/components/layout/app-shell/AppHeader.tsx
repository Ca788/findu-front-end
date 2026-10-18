'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import AddIcon from '@mui/icons-material/AddRounded';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { UserMenu } from '@/features/auth/components/userMenu/UserMenu';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import {
  isImmersiveChatPath,
  sectionTitle,
} from '@/components/layout/app-shell/appNavItems';
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDesktop, openRecent } = useAppShell();
  const chatRoute = isImmersiveChatPath(pathname);
  const immersive = chatRoute && !isDesktop;
  const onEmptyChat = pathname === AppRoutePaths.CHAT;

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-1.5 border-b border-(--mui-palette-divider) bg-(--mui-palette-background-default)/85 px-3 backdrop-blur md:px-6"
      style={{
        height: 'var(--app-header-height)',
        paddingTop: 'var(--app-safe-top)',
      }}
    >
      {immersive && (
        <Tooltip title="Voltar">
          <IconButton
            onClick={() => router.push(AppRoutePaths.DASHBOARD)}
            aria-label="Voltar"
            edge="start"
            size="medium"
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      )}

      {chatRoute ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            minWidth: 0,
            flex: 1,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="p"
              sx={{
                fontWeight: 650,
                fontSize: 16,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              Findu
            </Typography>
            <Typography
              component="p"
              sx={{
                fontSize: 12,
                color: 'text.secondary',
                lineHeight: 1.2,
              }}
            >
              Assistente financeiro
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          {(isDesktop || immersive) && (
            <Typography
              component="p"
              sx={{
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {sectionTitle(pathname ?? '')}
            </Typography>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }} />
        </>
      )}

      {chatRoute && (
        <>
          <Tooltip title="Conversas">
            <IconButton onClick={openRecent} aria-label="Abrir recentes" size="medium">
              <ForumOutlinedIcon />
            </IconButton>
          </Tooltip>
          {!onEmptyChat && (
            <Tooltip title="Nova conversa">
              <IconButton
                component={Link}
                href={AppRoutePaths.CHAT}
                aria-label="Nova conversa"
                size="medium"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}

      {!immersive && (
        <>
          <ThemeToggleButton />
          <UserMenu />
        </>
      )}
    </header>
  );
}
