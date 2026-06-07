'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { AxiosError } from 'axios';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
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

interface MessageComposerProps {
  conversationId: string;
}

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

export function MessageComposer({ conversationId }: MessageComposerProps) {
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
    const incoming = Array.from(selected);
    const allowed: File[] = [];
    for (const file of incoming) {
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

  return (
    <Paper className="flex flex-col gap-2 rounded-2xl px-3 py-2">
      {!inAudioMode && files.length > 0 && (
        <div className="flex flex-wrap gap-1">
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
        <AudioModePanel
          status={recorder.status}
          elapsedMs={recorder.elapsedMs}
          previewUrl={recorder.recorded?.url}
          isSending={isSending}
          onStop={() => recorder.stop()}
          onCancel={() => recorder.cancel()}
          onSend={submitAudio}
        />
      ) : (
        <div className="flex items-end gap-2">
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
            maxRows={6}
            fullWidth
            variant="standard"
            placeholder="Pergunte algo… (Enter envia, Shift+Enter quebra linha)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{ input: { disableUnderline: true } }}
          />
          {hasContent ? (
            <IconButton
              color="primary"
              onClick={submitText}
              disabled={isSending}
              aria-label="Enviar mensagem"
            >
              <SendIcon />
            </IconButton>
          ) : (
            <Tooltip title="Gravar áudio">
              <span>
                <IconButton
                  color="primary"
                  onClick={startRecording}
                  disabled={isSending}
                  aria-label="Gravar áudio"
                >
                  <MicIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </div>
      )}
    </Paper>
  );
}

interface AudioModePanelProps {
  status: ReturnType<typeof useAudioRecorder>['status'];
  elapsedMs: number;
  previewUrl?: string;
  isSending: boolean;
  onStop: () => void;
  onCancel: () => void;
  onSend: () => void;
}

function AudioModePanel({
  status,
  elapsedMs,
  previewUrl,
  isSending,
  onStop,
  onCancel,
  onSend,
}: AudioModePanelProps) {
  const isRecording = status === 'recording' || status === 'requesting';
  const isReady = status === 'ready';

  return (
    <div className="flex items-center gap-2">
      <Tooltip title="Cancelar">
        <span>
          <IconButton
            size="small"
            onClick={onCancel}
            disabled={isSending || status === 'stopping'}
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
          gap: 1.5,
          px: 1.5,
          py: 1,
          borderRadius: 1.5,
          bgcolor: 'action.hover',
        }}
      >
        {isRecording && (
          <Box
            aria-hidden="true"
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
              disabled={isSending}
              aria-label="Enviar áudio"
            >
              <SendIcon />
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
    </div>
  );
}
