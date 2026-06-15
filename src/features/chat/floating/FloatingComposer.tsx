'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { AxiosError } from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/SendOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFileOutlined';
import MicIcon from '@mui/icons-material/MicNoneOutlined';
import StopIcon from '@mui/icons-material/StopCircleOutlined';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { useAudioRecorder } from '@/features/chat/hooks/useAudioRecorder';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';

interface FloatingComposerProps {
  conversationId: string;
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf';
const MAX_FILES = 3;
const MAX_FILE_SIZE_MB = 15;

function createClientId(): string | undefined {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return undefined;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function FloatingComposer({ conversationId }: FloatingComposerProps) {
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showError } = useSnackbar();
  const { send, isSending } = useSendMessage(conversationId);
  const recorder = useAudioRecorder();

  const inAudioMode =
    recorder.status === 'requesting' ||
    recorder.status === 'recording' ||
    recorder.status === 'stopping' ||
    recorder.status === 'ready';

  const hasContent = body.trim().length > 0 || files.length > 0;

  const submitText = async () => {
    if (!hasContent || isSending) return;
    try {
      await send({
        body: body.trim() || undefined,
        attachments: files.length > 0 ? files : undefined,
        client_message_id: createClientId(),
      });
      setBody('');
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao enviar mensagem');
    }
  };

  const submitAudio = async () => {
    if (!recorder.recorded || isSending) return;
    try {
      await send({
        audio: recorder.recorded.blob,
        client_message_id: createClientId(),
      });
      recorder.reset();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao enviar áudio');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitText();
    }
  };

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const allowed: File[] = [];
    for (const file of Array.from(selected)) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        showError(`"${file.name}" excede ${MAX_FILE_SIZE_MB}MB`);
        continue;
      }
      allowed.push(file);
    }
    setFiles((prev) => [...prev, ...allowed].slice(0, MAX_FILES));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    await recorder.start();
    if (recorder.error) showError(recorder.error);
  };

  const isRecording = recorder.status === 'recording' || recorder.status === 'requesting';
  const isReady = recorder.status === 'ready';

  return (
    <Box
      className="flex flex-col gap-1.5 px-2 pt-2 pb-2"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      {!inAudioMode && files.length > 0 && (
        <div className="flex flex-wrap gap-1 px-1">
          {files.map((file, idx) => (
            <Chip
              key={`${file.name}-${idx}`}
              label={file.name}
              size="small"
              onDelete={() => removeFile(idx)}
            />
          ))}
        </div>
      )}

      {inAudioMode ? (
        <div className="flex items-center gap-1.5">
          <Tooltip title="Cancelar">
            <span>
              <IconButton
                size="small"
                onClick={() => recorder.cancel()}
                disabled={isSending || recorder.status === 'stopping'}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.25,
              py: 0.75,
              borderRadius: 1.5,
              bgcolor: 'action.hover',
            }}
          >
            {isRecording && (
              <Box
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  animation: 'fu-pulse 1.2s ease-in-out infinite',
                  '@keyframes fu-pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.35 },
                  },
                }}
              />
            )}
            {isReady && recorder.recorded?.url ? (
              <audio
                controls
                src={recorder.recorded.url}
                className="w-full"
                style={{ height: 28 }}
                preload="metadata"
              />
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {recorder.status === 'requesting'
                  ? 'Microfone…'
                  : recorder.status === 'stopping'
                    ? 'Finalizando…'
                    : `Gravando · ${formatDuration(recorder.elapsedMs)}`}
              </Typography>
            )}
          </Box>
          {isReady ? (
            <Tooltip title="Enviar áudio">
              <span>
                <IconButton color="primary" onClick={submitAudio} disabled={isSending}>
                  <SendIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Tooltip title="Parar">
              <span>
                <IconButton
                  color="primary"
                  onClick={() => recorder.stop()}
                  disabled={recorder.status !== 'recording'}
                >
                  <StopIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </div>
      ) : (
        <div className="flex items-end gap-1">
          <Tooltip title="Anexar imagem ou PDF">
            <span>
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending || files.length >= MAX_FILES}
                aria-label="Anexar arquivo"
              >
                <AttachFileIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
          <TextField
            multiline
            maxRows={4}
            fullWidth
            variant="standard"
            placeholder="Pergunte algo…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{ input: { disableUnderline: true } }}
          />
          {hasContent ? (
            <IconButton color="primary" onClick={submitText} disabled={isSending} aria-label="Enviar">
              <SendIcon />
            </IconButton>
          ) : (
            <Tooltip title="Gravar áudio">
              <span>
                <IconButton
                  color="primary"
                  onClick={startRecording}
                  disabled={isSending}
                  aria-label="Gravar"
                >
                  <MicIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </div>
      )}
    </Box>
  );
}
