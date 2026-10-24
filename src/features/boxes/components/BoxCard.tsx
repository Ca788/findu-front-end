'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import SwapVertIcon from '@mui/icons-material/SwapVertOutlined';
import { formatBRL } from '@/utils/currency';
import { BoxIllustrationView } from '@/features/boxes/components/BoxIllustrationView';
import { BoxProgressBar, boxAccent, boxProgress } from '@/features/boxes/components/BoxProgressBar';
import { BOX_KIND_LABELS, type Box as BoxModel } from '@/features/boxes/models/box.model';

interface BoxCardProps {
  box: BoxModel;
  celebrate?: boolean;
  onOpen: (box: BoxModel) => void;
  onMove: (box: BoxModel) => void;
}

export function BoxCard({ box, celebrate = false, onOpen, onMove }: BoxCardProps) {
  const accent = boxAccent(box);
  const { hasTarget, percent, completed } = boxProgress(box);

  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        p: 0,
        background: `linear-gradient(160deg, ${alpha(accent, 0.22)} 0%, ${alpha(accent, 0.04)} 60%)`,
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 14px 36px ${alpha(accent, 0.28)}`,
        },
      }}
    >
      <ButtonBase
        onClick={() => onOpen(box)}
        sx={{ display: 'block', width: '100%', textAlign: 'left', p: 2, borderRadius: 4 }}
        aria-label={`Abrir caixinha ${box.name}`}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              flexShrink: 0,
              width: 104,
              height: 104,
              borderRadius: '50%',
              bgcolor: alpha(accent, 0.18),
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <BoxIllustrationView illustrationKey={box.illustration_key} size={96} celebrate={celebrate} />
          </Box>
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ minWidth: 0, alignItems: 'center' }}>
              <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
                {box.name}
              </Typography>
              {completed && <Chip size="small" color="success" label="Meta atingida" />}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {BOX_KIND_LABELS[box.kind]}
            </Typography>
            <Typography variant="h6" sx={{ color: accent, fontWeight: 800 }}>
              {formatBRL(box.balance)}
            </Typography>
            {hasTarget && (
              <Stack spacing={0.5}>
                <BoxProgressBar box={box} />
                <Typography variant="caption" color="text.secondary">
                  {percent.toFixed(0)}% de {formatBRL(box.target_amount)}
                  {!completed && ` · faltam ${formatBRL(box.remaining_amount)}`}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </ButtonBase>
      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          size="small"
          variant="contained"
          startIcon={<SwapVertIcon />}
          onClick={() => onMove(box)}
          sx={{
            bgcolor: accent,
            color: '#fff',
            boxShadow: 'none',
            '&:hover': { bgcolor: accent, filter: 'brightness(0.92)' },
          }}
        >
          Guardar ou resgatar
        </Button>
      </Box>
    </Paper>
  );
}
