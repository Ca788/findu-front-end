'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { TypingDots } from '@/features/chat/components/messages/TypingDots';
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
          borderRadius: 3,
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          border: isUser ? 'none' : '1px solid',
          borderColor: 'divider',
          boxShadow: isUser
            ? `0 1px 2px ${theme.palette.primary.main}33`
            : 'none',
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
            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 14.5, lineHeight: 1.55 }}
          >
            {message.body}
            {isStreaming && (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block w-0.5 h-[1em] align-[-2px] bg-current animate-pulse"
              />
            )}
          </Typography>
        ) : pending ? (
          <TypingDots />
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
