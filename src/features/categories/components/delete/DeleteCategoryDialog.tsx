'use client';

import { AxiosError } from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useDeleteCategory } from '@/features/categories/hooks/useDeleteCategory';
import { useSnackbar } from '@/providers/SnackbarProvider';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import type { Category } from '@/features/categories/models/category.model';

interface DeleteCategoryDialogProps {
  open: boolean;
  category?: Category;
  onClose: () => void;
}

export function DeleteCategoryDialog({
  open,
  category,
  onClose,
}: DeleteCategoryDialogProps) {
  const { showSuccess, showError } = useSnackbar();
  const { mutateAsync, isPending } = useDeleteCategory();

  const handleConfirm = async () => {
    if (!category) return;
    try {
      await mutateAsync(category.id);
      showSuccess('Categoria removida');
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao remover categoria');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Remover categoria</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja remover{' '}
          <strong>{category?.name ?? 'esta categoria'}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button color="error" onClick={handleConfirm} disabled={isPending}>
          {isPending ? 'Removendo...' : 'Remover'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
