'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type {
  MessageAction,
  MessageCard,
} from '@/features/chat/models/message.model';

interface StructuredMessageProps {
  card?: MessageCard | null;
  actions?: MessageAction[];
  disabled?: boolean;
  visible?: boolean;
  onAction?: (action: MessageAction) => void;
}

export function StructuredMessage({
  card,
  actions = [],
  disabled = false,
  visible = true,
  onAction,
}: StructuredMessageProps) {
  const [usedId, setUsedId] = useState<string | null>(null);
  const hasCard = !!card && (card.title || (card.fields?.length ?? 0) > 0);
  const hasActions = actions.length > 0;

  if (!hasCard && !hasActions) return null;

  const handleAction = (action: MessageAction) => {
    if (disabled || usedId || !visible) return;
    setUsedId(action.id);
    onAction?.(action);
  };

  return (
    <Box
      aria-hidden={!visible}
      sx={{
        mt: visible ? { xs: 0.75, sm: 1 } : 0,
        width: { xs: '100%', sm: '78%' },
        maxWidth: { xs: '100%', sm: 420 },
        maxHeight: visible ? 320 : 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        overflow: 'hidden',
        pointerEvents: visible ? 'auto' : 'none',
        transition:
          'max-height 280ms ease, opacity 220ms ease, transform 220ms ease, margin 220ms ease',
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          transform: 'none',
        },
      }}
    >
      <Box
        sx={{
          borderRadius: { xs: 2, sm: 2.5 },
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        {hasCard ? (
          <Box sx={{ px: { xs: 1.25, sm: 1.75 }, py: { xs: 1, sm: 1.5 } }}>
            <Typography
              sx={{
                fontSize: { xs: 12.5, sm: 13.5 },
                fontWeight: 650,
                mb: card?.fields?.length ? { xs: 0.5, sm: 1 } : 0,
              }}
            >
              {card.title}
            </Typography>
            {card.fields?.map((field) => (
              <Box
                key={`${field.label}-${field.value}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                  py: { xs: 0.25, sm: 0.45 },
                }}
              >
                <Typography sx={{ fontSize: { xs: 11.5, sm: 12.5 }, color: 'text.secondary' }}>
                  {field.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 12, sm: 13 },
                    fontWeight: 600,
                    textAlign: 'right',
                  }}
                >
                  {field.value}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : null}

        {hasActions ? (
          <Box
            aria-label="Ações da mensagem"
            sx={{
              display: 'flex',
              flexWrap: { xs: 'nowrap', sm: 'wrap' },
              gap: { xs: 0.75, sm: 1 },
              px: { xs: 1, sm: 1.5 },
              py: { xs: 0.85, sm: 1.25 },
              borderTop: hasCard ? '1px solid' : 'none',
              borderColor: 'divider',
              overflowX: { xs: 'auto', sm: 'visible' },
              scrollSnapType: { xs: 'x mandatory', sm: 'none' },
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {actions.map((action) => {
              const secondary = action.variant === 'secondary';
              return (
                <Button
                  key={action.id}
                  size="small"
                  variant={secondary ? 'outlined' : 'contained'}
                  color={secondary ? 'inherit' : 'primary'}
                  disabled={disabled || !!usedId}
                  onClick={() => handleAction(action)}
                  sx={{
                    flex: { xs: '0 0 auto', sm: '0 1 auto' },
                    scrollSnapAlign: { xs: 'start', sm: 'unset' },
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: 12.5, sm: 13 },
                    borderRadius: 999,
                    px: { xs: 1.25, sm: 1.5 },
                    py: { xs: 0.35, sm: 0.5 },
                    minHeight: { xs: 30, sm: 32 },
                    whiteSpace: 'nowrap',
                  }}
                >
                  {action.label}
                </Button>
              );
            })}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
