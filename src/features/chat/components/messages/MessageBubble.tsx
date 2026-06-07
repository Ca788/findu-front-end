'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { formatTimeBR } from '@/utils/date';
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
        {message.body ? (
          <Typography variant="body2" component="div" className="whitespace-pre-wrap break-words">
            {message.body}
          </Typography>
        ) : pending ? (
          <div className="flex items-center gap-2">
            <CircularProgress size={14} thickness={5} color="inherit" />
            <Typography variant="body2">Pensando…</Typography>
          </div>
        ) : (
          <Typography variant="body2" color="text.secondary">
            (sem conteúdo)
          </Typography>
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
