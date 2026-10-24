'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { BOX_ILLUSTRATIONS } from '@/features/boxes/constants/boxCatalog';
import { BoxIllustrationView } from '@/features/boxes/components/BoxIllustrationView';
import type { BoxIllustrationKey } from '@/features/boxes/models/box.model';

interface BoxIllustrationPickerProps {
  value: BoxIllustrationKey;
  onChange: (key: BoxIllustrationKey) => void;
}

export function BoxIllustrationPicker({ value, onChange }: BoxIllustrationPickerProps) {
  return (
    <Box
      role="radiogroup"
      aria-label="Ilustração da caixinha"
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 1,
      }}
    >
      {BOX_ILLUSTRATIONS.map((item) => {
        const selected = item.key === value;
        return (
          <ButtonBase
            key={item.key}
            role="radio"
            aria-checked={selected}
            aria-label={item.label}
            onClick={() => onChange(item.key)}
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              p: 1,
              borderRadius: 3,
              border: `2px solid ${selected ? item.color : theme.palette.divider}`,
              bgcolor: selected ? alpha(item.color, 0.12) : 'background.paper',
              transition: 'transform 160ms ease, border-color 160ms ease, background-color 160ms ease',
              transform: selected ? 'scale(1.04)' : 'scale(1)',
              '&:hover': { transform: 'scale(1.04)', borderColor: item.color },
            })}
          >
            <BoxIllustrationView illustrationKey={item.key} size={56} animate={selected} />
            <Typography variant="caption" noWrap sx={{ maxWidth: '100%' }}>
              {item.label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
