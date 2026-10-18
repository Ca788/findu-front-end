'use client';

import { FormEvent, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
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

function SheetGrabber() {
  return (
    <Box
      aria-hidden
      sx={{
        width: 40,
        height: 4,
        borderRadius: 999,
        bgcolor: 'divider',
        mx: 'auto',
        mt: 1.25,
        mb: 0.5,
        flexShrink: 0,
      }}
    />
  );
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
  const { isDesktop } = useDevice();
  const sheet = !isDesktop;

  const form = (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 2,
          pt: sheet ? 1 : 2,
          pb: 1.5,
        }}
      >
        <Typography
          component="h2"
          sx={{ fontWeight: 700, fontSize: 18, minWidth: 0, flex: 1 }}
        >
          {title}
        </Typography>
        {sheet && (
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
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          px: 2,
          py: 1.5,
        }}
      >
        {children}
      </Box>

      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: sheet ? 'max(16px, env(safe-area-inset-bottom))' : 2,
          display: 'flex',
          gap: 1,
          flexShrink: 0,
        }}
      >
        {!sheet && (
          <Button onClick={onClose} disabled={isSubmitting}>
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          size="large"
          fullWidth={sheet}
          sx={sheet ? { borderRadius: 999, py: 1.35, fontWeight: 700, ml: 'auto' } : { ml: 'auto' }}
        >
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
      </Box>
    </Box>
  );

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
              maxHeight: '92dvh',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              maxWidth: 560,
              mx: 'auto',
              width: '100%',
            },
          },
        }}
      >
        <SheetGrabber />
        {form}
      </SwipeableDrawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      scroll="paper"
      slotProps={{
        paper: { sx: { borderRadius: 3 } },
      }}
    >
      <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
        <DialogTitle sx={{ fontWeight: 700, pb: 1.5 }}>{title}</DialogTitle>
        <DialogContent
          sx={{
            '&.MuiDialogContent-root': { paddingTop: 2 },
          }}
        >
          {children}
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
