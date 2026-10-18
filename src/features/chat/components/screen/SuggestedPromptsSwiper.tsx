'use client';

import type { ComponentType } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import {
  CHAT_SUGGESTED_PROMPTS,
  type ChatSuggestedPrompt,
} from '@/features/chat/constants/chatSuggestedPrompts';

const PROMPT_ICONS: Record<string, ComponentType<SvgIconProps>> = {
  'month-status': AccountBalanceWalletOutlinedIcon,
  'cut-expenses': ContentCutOutlinedIcon,
  'save-1000': SavingsOutlinedIcon,
  'installments-end': CreditScoreOutlinedIcon,
  'emergency-fund': ShieldOutlinedIcon,
  subscriptions: ReplayOutlinedIcon,
};

interface SuggestedPromptsSwiperProps {
  onSelectPrompt?: (prompt: ChatSuggestedPrompt) => void;
  disabled?: boolean;
}

export function SuggestedPromptsSwiper({
  onSelectPrompt,
  disabled = false,
}: SuggestedPromptsSwiperProps) {
  return (
    <Box
      aria-label="Sugestões rápidas"
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        px: { xs: 1.5, md: 3 },
        py: 1.25,
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {CHAT_SUGGESTED_PROMPTS.map((prompt) => {
        const Icon = PROMPT_ICONS[prompt.id] ?? AutoAwesomeOutlinedIcon;
        return (
          <Box
            key={prompt.id}
            component="button"
            type="button"
            aria-label={prompt.label}
            disabled={disabled}
            onClick={() => onSelectPrompt?.(prompt)}
            sx={(theme) => ({
              flex: '0 0 auto',
              width: 168,
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0.5,
              textAlign: 'left',
              px: 1.5,
              py: 1.25,
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.04)'
                  : 'background.paper',
              color: 'text.primary',
              cursor: disabled ? 'default' : 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              font: 'inherit',
              opacity: disabled ? 0.55 : 1,
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            })}
          >
            <Icon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography
              component="span"
              sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25 }}
            >
              {prompt.label}
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: 11.5, color: 'text.secondary', lineHeight: 1.3 }}
            >
              {prompt.hint}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
