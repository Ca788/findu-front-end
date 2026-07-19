'use client';

import { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useDevice } from '@/hooks/useDevice';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: 'primary' | 'error' | 'warning' | 'success';
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmColor = 'primary',
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const { isMobile } = useDevice();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: isMobile
            ? {
                m: 0,
                borderRadius: 0,
                maxHeight: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }
            : { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          pt: isMobile ? 'max(16px, env(safe-area-inset-top))' : 2,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ flex: isMobile ? '0 0 auto' : undefined }}>
        <DialogContentText component="div">{description}</DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          px: 2,
          pb: isMobile ? 'max(12px, env(safe-area-inset-bottom))' : 2,
          gap: 1,
          flexDirection: isMobile ? 'column-reverse' : 'row',
          '& > :not(style)': isMobile ? { width: '100%', m: 0 } : undefined,
        }}
      >
        <Button
          onClick={onClose}
          disabled={isLoading}
          size={isMobile ? 'large' : 'medium'}
          fullWidth={isMobile}
        >
          {cancelLabel}
        </Button>
        <Button
          color={confirmColor}
          variant="contained"
          onClick={onConfirm}
          disabled={isLoading}
          size={isMobile ? 'large' : 'medium'}
          fullWidth={isMobile}
        >
          {isLoading ? 'Processando...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
