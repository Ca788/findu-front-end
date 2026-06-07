'use client';

import { ChangeEvent, useRef } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import UploadIcon from '@mui/icons-material/UploadFileOutlined';
import CloseIcon from '@mui/icons-material/CloseOutlined';

interface ReceiptFieldProps {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function ReceiptField({ file, onChange, disabled }: ReceiptFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = () => inputRef.current?.click();
  const handleClear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
  };

  if (file) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[color:var(--mui-palette-divider)] px-3 py-2">
        <UploadIcon fontSize="small" color="primary" />
        <Typography variant="body2" className="min-w-0 flex-1 truncate">
          {file.name}
        </Typography>
        <IconButton size="small" onClick={handleClear} aria-label="Remover anexo">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={handlePick}
        disabled={disabled}
        fullWidth
      >
        Anexar comprovante
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
