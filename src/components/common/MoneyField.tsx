'use client';

import TextField, { type TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

type MoneyFieldProps = Omit<TextFieldProps, 'type'> & {
  emphasize?: boolean;
};

export function MoneyField({ emphasize = false, helperText, ...props }: MoneyFieldProps) {
  return (
    <TextField
      {...props}
      fullWidth
      placeholder={props.placeholder ?? '0,00'}
      helperText={helperText}
      slotProps={{
        inputLabel: { shrink: true },
        htmlInput: {
          inputMode: 'decimal',
          enterKeyHint: 'done',
          autoComplete: 'off',
        },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Typography
                component="span"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: emphasize ? '1.25rem' : '1rem',
                }}
              >
                R$
              </Typography>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        ...props.sx,
        '& .MuiInputBase-input': {
          fontVariantNumeric: 'tabular-nums',
          fontWeight: emphasize ? 700 : 600,
          fontSize: emphasize ? { xs: '2rem', sm: '1.75rem' } : undefined,
          letterSpacing: emphasize ? '-0.03em' : undefined,
          py: emphasize ? 1.5 : undefined,
        },
      }}
    />
  );
}
