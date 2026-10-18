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
  onAction?: (action: MessageAction) => void;
}

export function StructuredMessage({
  card,
  actions = [],
  disabled = false,
  onAction,
}: StructuredMessageProps) {
  const [usedId, setUsedId] = useState<string | null>(null);
  const hasCard = !!card && (card.title || (card.fields?.length ?? 0) > 0);
  const hasActions = actions.length > 0;

  if (!hasCard && !hasActions) return null;

  const handleAction = (action: MessageAction) => {
    if (disabled || usedId) return;
    setUsedId(action.id);
    onAction?.(action);
  };

  return (
    <Box
      sx={{
        mt: 1,
        width: { xs: '88%', sm: '78%' },
        maxWidth: 420,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      {hasCard ? (
        <Box sx={{ px: 1.75, py: 1.5 }}>
          <Typography sx={{ fontSize: 13.5, fontWeight: 650, mb: card?.fields?.length ? 1 : 0 }}>
            {card.title}
          </Typography>
          {card.fields?.map((field) => (
            <Box
              key={`${field.label}-${field.value}`}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                py: 0.45,
              }}
            >
              <Typography sx={{ fontSize: 12.5, color: 'text.secondary' }}>
                {field.label}
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>
                {field.value}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : null}

      {hasActions ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            px: 1.5,
            py: 1.25,
            borderTop: hasCard ? '1px solid' : 'none',
            borderColor: 'divider',
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
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 999,
                  px: 1.5,
                }}
              >
                {action.label}
              </Button>
            );
          })}
        </Box>
      ) : null}
    </Box>
  );
}
