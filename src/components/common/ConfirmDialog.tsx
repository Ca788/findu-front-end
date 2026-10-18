'use client';

import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
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
  const { isDesktop } = useDevice();
  const sheet = !isDesktop;

  if (sheet) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={() => undefined}
        disableSwipeToOpen
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              bgcolor: 'background.paper',
              px: 2,
              pt: 1,
              pb: 'max(16px, env(safe-area-inset-bottom))',
              maxWidth: 480,
              mx: 'auto',
              width: '100%',
            },
          },
        }}
      >
        <Box
          aria-hidden
          sx={{
            width: 40,
            height: 4,
            borderRadius: 999,
            bgcolor: 'divider',
            mx: 'auto',
            mb: 2,
          }}
        />
        <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }} component="div">
          {description}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            color={confirmColor}
            variant="contained"
            onClick={onConfirm}
            disabled={isLoading}
            size="large"
            fullWidth
            sx={{ borderRadius: 999, py: 1.35, fontWeight: 700 }}
          >
            {isLoading ? 'Processando...' : confirmLabel}
          </Button>
          <Button onClick={onClose} disabled={isLoading} size="large" fullWidth>
            {cancelLabel}
          </Button>
        </Box>
      </SwipeableDrawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: { sx: { borderRadius: 3 } },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          color={confirmColor}
          variant="contained"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
