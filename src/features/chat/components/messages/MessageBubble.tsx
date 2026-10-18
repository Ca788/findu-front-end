'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { ThinkingStatus } from '@/features/chat/components/messages/ThinkingStatus';
import { AssistantRichText } from '@/features/chat/components/messages/AssistantRichText';
import { StructuredMessage } from '@/features/chat/components/messages/StructuredMessage';
import { formatTimeBR } from '@/utils/date';
import { AttachmentChip } from '@/features/chat/components/messages/AttachmentChip';
import { AudioMessagePlayer } from '@/features/chat/components/messages/AudioMessagePlayer';
import type {
  ChatMessage,
  MessageAction,
} from '@/features/chat/models/message.model';

interface MessageBubbleProps {
  message: ChatMessage;
  onAction?: (action: MessageAction) => void;
  actionsDisabled?: boolean;
  revealActions?: boolean;
}

function isPending(status: ChatMessage['status']) {
  return status === 'pending' || status === 'processing';
}

export function MessageBubble({
  message,
  onAction,
  actionsDisabled = false,
  revealActions = true,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const failed = message.status === 'failed';
  const pending = isPending(message.status);
  const hasBody = !!message.body && message.body.length > 0;
  const isStreaming = pending && hasBody;
  const hasAudio = message.kind === 'audio' && !!message.audio_url;
  const hasAttachments = !!message.attachments && message.attachments.length > 0;
  const hasContent = hasBody || hasAudio || hasAttachments;
  const isThinking = !isUser && pending && !hasContent;
  const showStructure =
    !isUser && !pending && ((message.actions?.length ?? 0) > 0 || !!message.card);

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
          wordBreak: 'break-word',
        })}
      >
        {hasAudio && (
          <Box sx={{ mb: hasAudio && hasBody && !isUser ? 1 : 0 }}>
            <AudioMessagePlayer
              url={message.audio_url as string}
              tone={isUser ? 'user' : 'assistant'}
              transcript={isUser ? message.body : null}
            />
          </Box>
        )}
        {hasBody && !hasAudio ? (
          isUser ? (
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
            </Typography>
          ) : (
            <AssistantRichText text={message.body ?? ''} streaming={isStreaming} />
          )
        ) : null}
        {hasBody && hasAudio && !isUser ? (
          <AssistantRichText text={message.body ?? ''} streaming={isStreaming} />
        ) : null}
        {hasAttachments && (
          <Box sx={{ mt: hasBody || hasAudio ? 1 : 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {message.attachments!.map((att) => (
              <AttachmentChip key={att.id} attachment={att} />
            ))}
          </Box>
        )}
        {!hasContent && (
          <Typography variant="body2" color="text.secondary">
            (sem conteúdo)
          </Typography>
        )}
      </Box>

      {showStructure ? (
        <StructuredMessage
          card={message.card}
          actions={message.actions}
          disabled={actionsDisabled}
          visible={revealActions}
          onAction={onAction}
        />
      ) : null}

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
