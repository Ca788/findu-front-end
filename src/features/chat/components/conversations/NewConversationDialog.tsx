'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import TextField from '@mui/material/TextField';
import { FormDialog } from '@/components/common/FormDialog';
import { useCreateConversation } from '@/features/chat/hooks/useCreateConversation';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

interface NewConversationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NewConversationDialog({ open, onClose }: NewConversationDialogProps) {
  const [title, setTitle] = useState('');
  const router = useRouter();
  const { showError } = useSnackbar();
  const { mutateAsync, isPending } = useCreateConversation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const conversation = await mutateAsync({ title: title.trim() || undefined });
      setTitle('');
      onClose();
      router.push(`${AppRoutePaths.CHAT}/${conversation.id}`);
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao criar conversa');
    }
  };

  const handleClose = () => {
    setTitle('');
    onClose();
  };

  return (
    <FormDialog
      open={open}
      title="Nova conversa"
      submitLabel="Criar"
      onClose={handleClose}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      maxWidth="xs"
    >
      <TextField
        autoFocus
        fullWidth
        label="Título (opcional)"
        placeholder="Ex.: Compras de junho"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </FormDialog>
  );
}
