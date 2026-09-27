'use client';

import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { maskBrPhone } from '@/utils/maskedInput';

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  label: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  sx?: TextFieldProps['sx'];
}

export function PhoneField({
  value,
  onChange,
  onBlur,
  label,
  error,
  helperText,
  disabled,
  sx,
}: PhoneFieldProps) {
  return (
    <TextField
      label={label}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      placeholder="(11) 99999-9999"
      fullWidth
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(maskBrPhone(event.target.value))}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      sx={sx}
    />
  );
}
