'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { AxiosError } from 'axios';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/SendRounded';
import AttachFileIcon from '@mui/icons-material/AttachFileOutlined';
import MicIcon from '@mui/icons-material/MicNoneOutlined';
import StopIcon from '@mui/icons-material/StopCircleOutlined';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import { useAudioRecorder } from '@/features/chat/hooks/useAudioRecorder';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import type {
  ChatMessage,
  SendMessageInput,
} from '@/features/chat/models/message.model';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf';
const MAX_FILES = 5;
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

export interface ChatComposerProps {
  onSubmit: (input: SendMessageInput) => Promise<ChatMessage | void>;
  isSending?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxRows?: number;
}

export function ChatComposer({
  onSubmit,
  isSending = false,
  disabled = false,
  placeholder = 'Pergunte algo...',
  maxRows = 6,
}: ChatComposerProps) {
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showError } = useSnackbar();
  const recorder = useAudioRecorder();

  const inAudioMode =
    recorder.status === 'requesting' ||
    recorder.status === 'recording' ||
    recorder.status === 'stopping' ||
    recorder.status === 'ready';

  const hasContent = body.trim().length > 0 || files.length > 0;
  const isBusy = isSending || disabled;

  const submitText = async () => {
    if (!hasContent || isBusy) return;
    try {
      await onSubmit({
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
    if (!recorder.recorded || isBusy) return;
    try {
      await onSubmit({
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
      sx={{
        px: { xs: 1.25, sm: 2, md: 3 },
        pt: 1.25,
        pb: 1.25,
        mx: 'auto',
        width: '100%',
        maxWidth: 880,
      }}
    >
      {!inAudioMode && files.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
          {files.map((file, idx) => (
            <Chip
              key={`${file.name}-${idx}`}
              label={file.name}
              size="small"
              onDelete={() => removeFile(idx)}
              sx={{ maxWidth: 220 }}
            />
          ))}
        </Box>
      )}

      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: inAudioMode ? 'center' : 'flex-end',
          gap: 0.5,
          px: 1,
          py: 0.75,
          borderRadius: 28,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['border-color', 'box-shadow'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: `0 0 0 4px ${theme.palette.primary.main}1f`,
          },
        })}
      >
        {inAudioMode ? (
          <AudioModeRow
            status={recorder.status}
            elapsedMs={recorder.elapsedMs}
            previewUrl={recorder.recorded?.url}
            isBusy={isBusy}
            onStop={() => recorder.stop()}
            onCancel={() => recorder.cancel()}
            onSend={submitAudio}
            isRecording={isRecording}
            isReady={isReady}
          />
        ) : (
          <>
            <Tooltip title="Anexar imagem ou PDF">
              <span>
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy || files.length >= MAX_FILES}
                  aria-label="Anexar arquivo"
                  sx={{ alignSelf: 'flex-end', mb: 0.25 }}
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
              maxRows={maxRows}
              fullWidth
              variant="standard"
              placeholder={placeholder}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isBusy}
              slotProps={{ input: { disableUnderline: true } }}
              sx={{
                alignSelf: 'center',
                '& .MuiInputBase-root': { px: 0.5, py: 0.75, fontSize: 15 },
              }}
            />
            {hasContent ? (
              <Tooltip title="Enviar">
                <span>
                  <IconButton
                    color="primary"
                    onClick={submitText}
                    disabled={isBusy}
                    aria-label="Enviar mensagem"
                    sx={(theme) => ({
                      alignSelf: 'flex-end',
                      mb: 0.25,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.dark' },
                      transition: theme.transitions.create('transform', {
                        duration: theme.transitions.duration.shorter,
                      }),
                      '&:active': { transform: 'scale(0.94)' },
                    })}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Gravar áudio">
                <span>
                  <IconButton
                    onClick={startRecording}
                    disabled={isBusy}
                    aria-label="Gravar áudio"
                    sx={{ alignSelf: 'flex-end', mb: 0.25 }}
                  >
                    <MicIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

interface AudioModeRowProps {
  status: ReturnType<typeof useAudioRecorder>['status'];
  elapsedMs: number;
  previewUrl?: string;
  isBusy: boolean;
  onStop: () => void;
  onCancel: () => void;
  onSend: () => void;
  isRecording: boolean;
  isReady: boolean;
}

function AudioModeRow({
  status,
  elapsedMs,
  previewUrl,
  isBusy,
  onStop,
  onCancel,
  onSend,
  isRecording,
  isReady,
}: AudioModeRowProps) {
  return (
    <>
      <Tooltip title="Cancelar">
        <span>
          <IconButton
            size="small"
            onClick={onCancel}
            disabled={isBusy || status === 'stopping'}
            aria-label="Cancelar gravação"
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
        }}
      >
        {isRecording && (
          <Box
            aria-hidden
            sx={{
              width: 10,
              height: 10,
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
        {isReady && previewUrl ? (
          <audio
            controls
            src={previewUrl}
            className="w-full"
            style={{ height: 32 }}
            preload="metadata"
          />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {status === 'requesting'
              ? 'Solicitando microfone…'
              : status === 'stopping'
                ? 'Finalizando…'
                : `Gravando · ${formatDuration(elapsedMs)}`}
          </Typography>
        )}
      </Box>

      {isReady ? (
        <Tooltip title="Enviar áudio">
          <span>
            <IconButton
              color="primary"
              onClick={onSend}
              disabled={isBusy}
              aria-label="Enviar áudio"
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Tooltip title="Parar gravação">
          <span>
            <IconButton
              color="primary"
              onClick={onStop}
              disabled={status !== 'recording'}
              aria-label="Parar gravação"
            >
              <StopIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </>
  );
}
