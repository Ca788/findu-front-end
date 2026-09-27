'use client';

import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { maskEmail } from '@/utils/maskedInput';

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  label: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  sx?: TextFieldProps['sx'];
  slotProps?: TextFieldProps['slotProps'];
}

export function EmailField({
  value,
  onChange,
  onBlur,
  label,
  error,
  helperText,
  disabled,
  autoFocus,
  sx,
  slotProps,
}: EmailFieldProps) {
  return (
    <TextField
      label={label}
      type="email"
      inputMode="email"
      autoComplete="email"
      placeholder="nome@email.com"
      fullWidth
      autoFocus={autoFocus}
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(maskEmail(event.target.value))}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      sx={sx}
      slotProps={slotProps}
    />
  );
}
