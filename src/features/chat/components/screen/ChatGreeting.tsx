'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import {
  CHAT_SUGGESTED_PROMPTS,
  type ChatSuggestedPrompt,
} from '@/features/chat/constants/chatSuggestedPrompts';

interface ChatGreetingProps {
  onSelectPrompt?: (prompt: ChatSuggestedPrompt) => void;
  disabled?: boolean;
}

export function ChatGreeting({ onSelectPrompt, disabled = false }: ChatGreetingProps) {
  const { user } = useCurrentUser();
  const firstName = (user?.name ?? '').trim().split(/\s+/)[0] || '';

  return (
    <Box
      className="findu-anim-fade-in"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.75,
        textAlign: 'center',
        px: 2,
        width: '100%',
        maxWidth: 520,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'action.hover',
        }}
      >
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 22, color: 'primary.main' }} />
      </Box>

      {firstName ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: 14, letterSpacing: 0.01 }}
        >
          Olá, {firstName}
        </Typography>
      ) : null}

      <Typography
        variant="h4"
        component="h2"
        sx={{
          m: 0,
          fontWeight: 560,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          fontSize: { xs: '1.45rem', sm: '1.7rem' },
          color: 'text.primary',
          maxWidth: 280,
        }}
      >
        Como posso ajudar?
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
        Escolha uma pergunta ou digite a sua
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
          mt: 0.5,
          width: '100%',
        }}
      >
        {CHAT_SUGGESTED_PROMPTS.map((prompt) => (
          <Chip
            key={prompt.id}
            label={prompt.label}
            clickable={!disabled}
            disabled={disabled}
            onClick={() => onSelectPrompt?.(prompt)}
            sx={{
              borderRadius: '12px',
              height: 'auto',
              py: 0.85,
              px: 0.25,
              fontWeight: 500,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiChip-label': {
                whiteSpace: 'normal',
                textAlign: 'left',
                lineHeight: 1.25,
                px: 1.25,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
