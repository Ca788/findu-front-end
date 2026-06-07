'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { TypingDots } from '@/features/chat/components/messages/TypingDots';
import { formatTimeBR } from '@/utils/date';
import { AttachmentChip } from '@/features/chat/components/messages/AttachmentChip';
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

  const bubbleClasses = [
    'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2',
    isUser ? 'self-end' : 'self-start',
  ].join(' ');

  return (
    <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
      <Paper
        elevation={0}
        className={bubbleClasses}
        sx={{
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          border: isUser ? 'none' : '1px solid',
          borderColor: 'divider',
        }}
      >
        {hasBody ? (
          <Typography variant="body2" component="div" className="whitespace-pre-wrap wrap-break-word">
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
        ) : (
          <Typography variant="body2" color="text.secondary">
            (sem conteúdo)
          </Typography>
        )}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((att) => (
              <AttachmentChip key={att.id} attachment={att} />
            ))}
          </div>
        )}
      </Paper>

      <div className="flex items-center gap-1 px-1">
        {failed && <ErrorOutlineIcon fontSize="small" color="error" />}
        <Typography variant="caption" color={failed ? 'error.main' : 'text.secondary'}>
          {failed ? 'Falha ao processar · ' : ''}
          {formatTimeBR(message.created_at)}
        </Typography>
      </div>
    </div>
  );
}
