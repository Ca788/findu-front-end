'use client';

import { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import { useAppShell } from '@/components/layout/app-shell/AppShellContext';

interface ChatLayoutProps {
  topbar?: ReactNode;
  messages: ReactNode;
  suggestions?: ReactNode;
  composer: ReactNode;
}

export function ChatLayout({ topbar, messages, suggestions, composer }: ChatLayoutProps) {
  const { keyboardOpen } = useAppShell();

  return (
    <Box
      className="findu-aurora-glow"
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {topbar && (
        <Box
          sx={{
            flexShrink: 0,
            px: { xs: 1.5, md: 3 },
            py: 1,
          }}
        >
          {topbar}
        </Box>
      )}
      <Box
        className="findu-scroll-smooth"
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages}
      </Box>
      {suggestions && !keyboardOpen ? (
        <Box sx={{ flexShrink: 0 }}>{suggestions}</Box>
      ) : null}
      <Box
        sx={{
          flexShrink: 0,
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider',
          pb: keyboardOpen ? 0 : 'var(--app-safe-bottom)',
        }}
      >
        {composer}
      </Box>
    </Box>
  );
}
