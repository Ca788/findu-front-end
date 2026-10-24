'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface DashboardCardProps {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, subtitle, action, children, className }: DashboardCardProps) {
  return (
    <Paper
      variant="outlined"
      className={className}
      sx={{
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderRadius: '14px',
        px: 2,
        py: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'center' }}>
        {children}
      </Box>
    </Paper>
  );
}
