'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { AxiosError } from 'axios';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/AddRounded';
import SendIcon from '@mui/icons-material/ArrowUpwardRounded';
import MicIcon from '@mui/icons-material/MicNoneOutlined';
import StopIcon from '@mui/icons-material/StopRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useAudioRecorder } from '@/features/chat/hooks/useAudioRecorder';
import { ComposerAttachSheet, type AttachSheetAction } from '@/features/chat/components/screen/ComposerAttachSheet';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import type {
  ChatMessage,
  SendMessageInput,
} from '@/features/chat/models/message.model';

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp,image/heic,image/heif';
const ACCEPT_FILES = `${ACCEPT_IMAGES},application/pdf`;
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
  placeholder = 'Pergunte algo…',
  maxRows = 6,
}: ChatComposerProps) {
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [attachOpen, setAttachOpen] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const filesInputRef = useRef<HTMLInputElement | null>(null);
  const { showError } = useSnackbar();
  const recorder = useAudioRecorder();

  const inAudioMode =
    recorder.status === 'requesting' ||
    recorder.status === 'recording' ||
    recorder.status === 'stopping' ||
    recorder.status === 'ready';

  const hasContent = body.trim().length > 0 || files.length > 0;
  const isBusy = isSending || disabled;
  const isRecording =
    recorder.status === 'recording' || recorder.status === 'requesting';
  const isReady = recorder.status === 'ready';

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
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (filesInputRef.current) filesInputRef.current.value = '';
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao enviar mensagem');
    }
  };

  const submitAudioBlob = async (blob: Blob) => {
    if (isBusy) return;
    try {
      await onSubmit({
        audio: blob,
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

  const submitAudio = async () => {
    if (isRecording) {
      const recorded = await recorder.stop();
      if (recorded) await submitAudioBlob(recorded.blob);
      return;
    }
    if (recorder.recorded) await submitAudioBlob(recorder.recorded.blob);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitText();
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
    const error = await recorder.start();
    if (error) showError(error);
  };

  const onAttachSelect = (action: AttachSheetAction) => {
    switch (action) {
      case 'gallery':
        galleryInputRef.current?.click();
        break;
      case 'camera':
        cameraInputRef.current?.click();
        break;
      case 'files':
        filesInputRef.current?.click();
        break;
      default: {
        const _exhaustive: never = action;
        return _exhaustive;
      }
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 1.25, sm: 2, md: 3 },
        pt: 1,
        pb: 1.25,
        mx: 'auto',
        width: '100%',
        maxWidth: 880,
      }}
    >
      {inAudioMode && isRecording && (
        <Box
          sx={(theme) => ({
            mb: 1,
            mx: 'auto',
            maxWidth: 420,
            px: 2,
            py: 1.1,
            borderRadius: 2.5,
            textAlign: 'center',
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.1)'
                : 'grey.100',
          })}
        >
          <Typography variant="caption" sx={{ fontSize: 12.5, color: 'text.primary' }}>
            Quando terminar de falar, toque em &quot;Parar&quot; ou &quot;Enviar&quot;
          </Typography>
        </Box>
      )}

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
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.65,
          minHeight: 52,
          borderRadius: 999,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.06)'
              : 'background.paper',
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
            levels={recorder.levels}
            isBusy={isBusy}
            onStop={() => void recorder.stop()}
            onCancel={() => recorder.cancel()}
            onSend={() => void submitAudio()}
            isRecording={isRecording}
            isReady={isReady}
          />
        ) : (
          <>
            <Tooltip title="Anexar">
              <span>
                <IconButton
                  size="small"
                  onClick={() => setAttachOpen(true)}
                  disabled={isBusy || files.length >= MAX_FILES}
                  aria-label="Anexar arquivo"
                >
                  <AddIcon />
                </IconButton>
              </span>
            </Tooltip>

            <input
              ref={galleryInputRef}
              type="file"
              accept={ACCEPT_IMAGES}
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
            <input
              ref={filesInputRef}
              type="file"
              accept={ACCEPT_FILES}
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
                    onClick={() => void submitText()}
                    disabled={isBusy}
                    aria-label="Enviar mensagem"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.dark' },
                      '&:active': { transform: 'scale(0.94)' },
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Gravar áudio">
                <span>
                  <IconButton
                    onClick={() => void startRecording()}
                    disabled={isBusy}
                    aria-label="Gravar áudio"
                    sx={(theme) => ({
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.08)'
                          : 'action.hover',
                    })}
                  >
                    <MicIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </>
        )}
      </Box>

      <ComposerAttachSheet
        open={attachOpen}
        onClose={() => setAttachOpen(false)}
        onSelect={onAttachSelect}
        disabled={isBusy || files.length >= MAX_FILES}
      />
    </Box>
  );
}

interface AudioModeRowProps {
  status: ReturnType<typeof useAudioRecorder>['status'];
  elapsedMs: number;
  levels: number[];
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
  levels,
  isBusy,
  onStop,
  onCancel,
  onSend,
  isRecording,
  isReady,
}: AudioModeRowProps) {
  const canSend =
    (isReady || isRecording) && status !== 'stopping' && status !== 'requesting';

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
          gap: 1,
          minWidth: 0,
          px: 0.5,
        }}
      >
        <Waveform levels={levels} active={isRecording} />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0, minWidth: 42 }}
        >
          {status === 'requesting'
            ? '…'
            : status === 'stopping'
              ? '…'
              : formatDuration(elapsedMs)}
        </Typography>
      </Box>

      {isRecording && (
        <Tooltip title="Parar">
          <span>
            <IconButton
              onClick={onStop}
              disabled={status !== 'recording'}
              aria-label="Parar gravação"
              sx={(theme) => ({
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'action.hover',
              })}
            >
              <StopIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}

      <Tooltip title="Enviar áudio">
        <span>
          <IconButton
            color="primary"
            onClick={onSend}
            disabled={isBusy || !canSend}
            aria-label="Enviar áudio"
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
              },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}

function Waveform({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <Box
      aria-hidden
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5px',
        height: 28,
        minWidth: 0,
        opacity: active ? 1 : 0.55,
      }}
    >
      {levels.map((level, index) => (
        <Box
          key={index}
          sx={{
            width: 2.5,
            height: `${Math.max(18, level * 100)}%`,
            borderRadius: 999,
            bgcolor: 'text.primary',
            transition: active ? 'height 80ms linear' : 'height 200ms ease',
          }}
        />
      ))}
    </Box>
  );
}
