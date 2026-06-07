'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { AxiosError } from 'axios';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import SendIcon from '@mui/icons-material/SendOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFileOutlined';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
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

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showError } = useSnackbar();
  const { mutateAsync, isPending } = useSendMessage();

  const hasContent = body.trim().length > 0 || files.length > 0;

  const submit = async () => {
    if (!hasContent || isPending) return;
    try {
      await mutateAsync({
        conversationId,
        input: {
          body: body.trim() || undefined,
          attachments: files.length > 0 ? files : undefined,
          client_message_id: createClientId(),
        },
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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
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

  return (
    <Paper className="flex flex-col gap-2 rounded-2xl px-3 py-2">
      {files.length > 0 && (
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
      <div className="flex items-end gap-2">
        <Tooltip title="Anexar imagem ou PDF">
          <span>
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending || files.length >= MAX_FILES}
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
        <IconButton
          color="primary"
          onClick={submit}
          disabled={isPending || !hasContent}
          aria-label="Enviar mensagem"
        >
          <SendIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
