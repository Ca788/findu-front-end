'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { todosHubNavItems } from '@/components/layout/app-shell/appNavItems';

export function TodosPage() {
  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.25}>
        <Typography variant="body2" color="text.secondary">
          Menu
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.03em',
            fontSize: '1.65rem',
            lineHeight: 1.15,
          }}
        >
          Todos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>
          Atalhos para as demais áreas do Findu
        </Typography>
      </Stack>

      <div className="grid grid-cols-2 gap-2.5">
        {todosHubNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Paper
              key={item.href}
              component={Link}
              href={item.href}
              className="flex flex-col items-start gap-2.5 rounded-xl px-3.5 py-3.5 no-underline"
              sx={{ color: 'inherit', minHeight: 104 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'action.hover',
                }}
              >
                <Icon fontSize="small" />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.25,
                  width: '100%',
                  wordBreak: 'break-word',
                }}
              >
                {item.label}
              </Typography>
            </Paper>
          );
        })}
      </div>
    </Stack>
  );
}
