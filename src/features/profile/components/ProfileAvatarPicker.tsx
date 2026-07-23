'use client';

import { useEffect, useMemo, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PhotoCameraIcon from '@mui/icons-material/PhotoCameraOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { absoluteApiUrl } from '@/utils/url';
import { getInitials } from '@/utils/initials';

interface ProfileAvatarPickerProps {
  currentAvatarUrl?: string | null;
  fallbackName?: string | null;
  fallbackEmail?: string | null;
  file: File | null;
  removed: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  onUndoRemove: () => void;
}

const ACCEPT = 'image/png,image/jpeg,image/webp';

export function ProfileAvatarPicker({
  currentAvatarUrl,
  fallbackName,
  fallbackEmail,
  file,
  removed,
  errorMessage,
  disabled,
  onFileChange,
  onRemove,
  onUndoRemove,
}: ProfileAvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const displayedSrc = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (removed) return undefined;
    return currentAvatarUrl ? absoluteApiUrl(currentAvatarUrl) : undefined;
  }, [previewUrl, removed, currentAvatarUrl]);

  const initials = getInitials(fallbackName, fallbackEmail);
  const hasCurrent = !!currentAvatarUrl;
  const showRemove = (hasCurrent && !removed) || !!file;

  const handlePick = () => inputRef.current?.click();

  const handleFile = (selected: FileList | null) => {
    const next = selected?.[0] ?? null;
    onFileChange(next);
  };

  const handleRemoveClick = () => {
    if (file) {
      onFileChange(null);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    onRemove();
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Avatar src={displayedSrc} sx={{ width: 80, height: 80, fontSize: 24 }}>
        {initials}
      </Avatar>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<PhotoCameraIcon />}
            onClick={handlePick}
            disabled={disabled}
          >
            {file || (hasCurrent && !removed) ? 'Trocar foto' : 'Adicionar foto'}
          </Button>
          {showRemove && (
            <Button
              color="error"
              variant="text"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleRemoveClick}
              disabled={disabled}
            >
              Remover
            </Button>
          )}
          {removed && !file && (
            <Button
              variant="text"
              size="small"
              onClick={onUndoRemove}
              disabled={disabled}
            >
              Desfazer
            </Button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          hidden
          onChange={(e) => handleFile(e.target.files)}
        />

        <Typography
          variant="caption"
          color={errorMessage ? 'error.main' : 'text.secondary'}
        >
          {errorMessage ?? 'PNG, JPEG ou WEBP. Máximo 5MB.'}
        </Typography>
      </div>
    </div>
  );
}
