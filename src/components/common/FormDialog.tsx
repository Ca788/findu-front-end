'use client';

import { FormEvent, ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useDevice } from '@/hooks/useDevice';

interface FormDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export function FormDialog({
  open,
  title,
  children,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  maxWidth = 'sm',
}: FormDialogProps) {
  const { isMobile } = useDevice();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      fullScreen={isMobile}
      scroll="paper"
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
              }
            : { borderRadius: 3 },
        },
      }}
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex min-h-0 flex-1 flex-col"
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            pt: isMobile ? 'max(12px, env(safe-area-inset-top))' : 2,
            pb: 1.5,
            px: 2,
            fontWeight: 700,
          }}
        >
          <span className="min-w-0 flex-1 truncate">{title}</span>
          {isMobile && (
            <IconButton
              edge="end"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Fechar"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent
          dividers={isMobile}
          sx={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            px: 2,
            py: 2,
            '&.MuiDialogContent-root': { paddingTop: 2 },
          }}
        >
          {children}
        </DialogContent>

        <DialogActions
          sx={{
            px: 2,
            pt: 1.5,
            pb: isMobile ? 'max(16px, env(safe-area-inset-bottom))' : 2,
            gap: 1,
            flexDirection: 'row',
            '& > :not(style)': isMobile ? { m: 0 } : undefined,
          }}
        >
          {!isMobile && (
            <Button onClick={onClose} disabled={isSubmitting}>
              {cancelLabel}
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            size="large"
            fullWidth={isMobile}
            sx={isMobile ? { borderRadius: 999, py: 1.35, fontWeight: 700 } : undefined}
          >
            {isSubmitting ? 'Salvando...' : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
