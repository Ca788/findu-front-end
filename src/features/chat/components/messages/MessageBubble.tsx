'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { ThinkingStatus } from '@/features/chat/components/messages/ThinkingStatus';
import { formatTimeBR } from '@/utils/date';
import { AttachmentChip } from '@/features/chat/components/messages/AttachmentChip';
import { AudioMessagePlayer } from '@/features/chat/components/messages/AudioMessagePlayer';
import type { ChatMessage } from '@/features/chat/models/message.model';

interface MessageBubbleProps {
  message: ChatMessage;
}

function isPending(status: ChatMessage['status']) {
  return status === 'pending' || status === 'processing';
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const failed = message.status === 'failed';
  const pending = isPending(message.status);
  const hasBody = !!message.body && message.body.length > 0;
  const isStreaming = pending && hasBody;
  const hasAudio = message.kind === 'audio' && !!message.audio_url;
  const isThinking = !isUser && pending && !hasBody && !hasAudio;

  if (isThinking) {
    return (
      <Box
        className="findu-anim-fade-in"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 0.5,
          py: 0.5,
        }}
      >
        <ThinkingStatus urgent={message.status === 'pending'} />
      </Box>
    );
  }

  return (
    <Box
      className="findu-anim-fade-in"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <Box
        sx={(theme) => ({
          maxWidth: { xs: '88%', sm: '78%' },
          px: 2,
          py: 1.25,
          borderRadius: isUser ? '22px 22px 6px 22px' : '22px 22px 22px 6px',
          bgcolor: isUser
            ? theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'primary.main'
            : 'transparent',
          color: isUser
            ? theme.palette.mode === 'dark'
              ? 'text.primary'
              : 'primary.contrastText'
            : 'text.primary',
          border: isUser ? 'none' : 'none',
          wordBreak: 'break-word',
        })}
      >
        {hasAudio && (
          <Box sx={{ mb: hasBody ? 1 : 0 }}>
            <AudioMessagePlayer
              url={message.audio_url as string}
              tone={isUser ? 'user' : 'assistant'}
            />
          </Box>
        )}
        {hasBody ? (
          <Typography
            variant="body2"
            component="div"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: 15,
              lineHeight: 1.65,
              letterSpacing: 0.01,
            }}
          >
            {message.body}
            {isStreaming && (
              <Box
                component="span"
                aria-hidden
                sx={{
                  display: 'inline-block',
                  width: 7,
                  height: 7,
                  ml: 0.75,
                  mb: '1px',
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  verticalAlign: 'baseline',
                  animation: 'fu-stream-dot 1.1s ease-in-out infinite',
                  '@keyframes fu-stream-dot': {
                    '0%, 100%': { opacity: 0.35, transform: 'scale(0.85)' },
                    '50%': { opacity: 1, transform: 'scale(1)' },
                  },
                }}
              />
            )}
          </Typography>
        ) : hasAudio ? null : (
          <Typography variant="body2" color="text.secondary">
            (sem conteúdo)
          </Typography>
        )}
        {message.attachments && message.attachments.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {message.attachments.map((att) => (
              <AttachmentChip key={att.id} attachment={att} />
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.5 }}>
        {failed && <ErrorOutlineIcon fontSize="small" color="error" />}
        <Typography
          variant="caption"
          color={failed ? 'error.main' : 'text.secondary'}
          sx={{ fontSize: 11 }}
        >
          {failed ? 'Falha ao processar · ' : ''}
          {formatTimeBR(message.created_at)}
        </Typography>
      </Box>
    </Box>
  );
}
