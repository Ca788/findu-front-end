'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/AddOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export function ChatConversationHeader() {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 36,
      }}
    >
      <Tooltip title="Nova conversa">
        <IconButton
          component={Link}
          href={AppRoutePaths.CHAT}
          aria-label="Nova conversa"
          size="small"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
