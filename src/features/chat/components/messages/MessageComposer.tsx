'use client';

import { useState, type KeyboardEvent } from 'react';
import { AxiosError } from 'axios';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/SendOutlined';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';

interface MessageComposerProps {
  conversationId: string;
}

function createClientId(): string | undefined {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return undefined;
}

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [body, setBody] = useState('');
  const { showError } = useSnackbar();
  const { mutateAsync, isPending } = useSendMessage();

  const submit = async () => {
    const trimmed = body.trim();
    if (!trimmed || isPending) return;
    try {
      await mutateAsync({
        conversationId,
        input: { body: trimmed, client_message_id: createClientId() },
      });
      setBody('');
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

  return (
    <Paper className="flex items-end gap-2 rounded-2xl px-3 py-2">
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
        disabled={isPending || !body.trim()}
        aria-label="Enviar mensagem"
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
}
