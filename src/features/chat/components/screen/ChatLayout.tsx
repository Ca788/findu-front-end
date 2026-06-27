'use client';

import { type ReactNode } from 'react';
import Box from '@mui/material/Box';

interface ChatLayoutProps {
  topbar?: ReactNode;
  messages: ReactNode;
  composer: ReactNode;
}

export function ChatLayout({ topbar, messages, composer }: ChatLayoutProps) {
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
      <Box
        sx={{
          flexShrink: 0,
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider',
          paddingBottom: 'var(--app-safe-bottom)',
        }}
      >
        {composer}
      </Box>
    </Box>
  );
}
