'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export type AttachSheetAction = 'gallery' | 'camera' | 'files';

interface ComposerAttachSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (action: AttachSheetAction) => void;
  disabled?: boolean;
}

const PRIMARY_ACTIONS: Array<{
  id: AttachSheetAction;
  label: string;
  icon: typeof AddPhotoAlternateOutlinedIcon;
}> = [
  { id: 'gallery', label: 'Fotos', icon: AddPhotoAlternateOutlinedIcon },
  { id: 'camera', label: 'Câmera', icon: CameraAltOutlinedIcon },
  { id: 'files', label: 'Arquivos', icon: AttachFileOutlinedIcon },
];

const SECONDARY = [
  {
    icon: ImageOutlinedIcon,
    title: 'Imagens',
    subtitle: 'Galeria ou câmera',
    action: 'gallery' as const,
  },
  {
    icon: DescriptionOutlinedIcon,
    title: 'Documentos',
    subtitle: 'PDF e imagens',
    action: 'files' as const,
  },
];

export function ComposerAttachSheet({
  open,
  onClose,
  onSelect,
  disabled = false,
}: ComposerAttachSheetProps) {
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
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            bgcolor: 'background.paper',
            px: 2,
            pt: 1,
            pb: 'max(20px, env(safe-area-inset-bottom))',
            maxWidth: 560,
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
          mb: 2.5,
        }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1.25,
          mb: 2.5,
        }}
      >
        {PRIMARY_ACTIONS.map(({ id, label, icon: Icon }) => (
          <Box
            key={id}
            component="button"
            type="button"
            disabled={disabled}
            onClick={() => {
              onSelect(id);
              onClose();
            }}
            sx={(theme) => ({
              appearance: 'none',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              minHeight: 96,
              borderRadius: 3.5,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.06)'
                  : 'action.hover',
              color: 'text.primary',
              transition: theme.transitions.create(['background-color', 'transform'], {
                duration: theme.transitions.duration.shorter,
              }),
              '&:active': { transform: 'scale(0.97)' },
              '&:disabled': { opacity: 0.5 },
            })}
          >
            <Icon sx={{ fontSize: 28 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Stack spacing={0.25}>
        {SECONDARY.map(({ icon: Icon, title, subtitle, action }) => (
          <Box
            key={title}
            component="button"
            type="button"
            disabled={disabled}
            onClick={() => {
              onSelect(action);
              onClose();
            }}
            sx={(theme) => ({
              appearance: 'none',
              border: 'none',
              background: 'transparent',
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: '100%',
              textAlign: 'left',
              px: 1,
              py: 1.25,
              borderRadius: 2,
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' },
              '&:disabled': { opacity: 0.5 },
              transition: theme.transitions.create('background-color', {
                duration: theme.transitions.duration.shorter,
              }),
            })}
          >
            <IconButton
              size="small"
              tabIndex={-1}
              sx={{
                bgcolor: 'action.hover',
                pointerEvents: 'none',
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </SwipeableDrawer>
  );
}
