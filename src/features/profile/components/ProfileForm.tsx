'use client';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useUpdateProfile } from '@/features/auth/hooks/useUpdateProfile';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { ProfileAvatarPicker } from '@/features/profile/components/ProfileAvatarPicker';
import {
  profileFormSchema,
  type ProfileFormValues,
} from '@/features/profile/components/profileFormSchema';
import type { AppErrorResult } from '@/infrastructure/AppResponse';

function buildDefaultValues(name?: string, phone?: string | null): ProfileFormValues {
  return {
    name: name ?? '',
    phone: phone ?? '',
    avatar: undefined,
  };
}

export function ProfileForm() {
  const { user } = useCurrentUser();
  const { update, isLoading } = useUpdateProfile();
  const { showSuccess, showError } = useSnackbar();
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: buildDefaultValues(user?.name, user?.phone),
  });

  useEffect(() => {
    if (!user) return;
    reset(buildDefaultValues(user.name, user.phone));
    setRemoveAvatar(false);
  }, [user, reset]);

  const avatarFile = watch('avatar') ?? null;
  const hasAvatarChange = !!avatarFile || removeAvatar;
  const canSubmit = (isDirty || hasAvatarChange) && !isLoading;

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await update({
        name: values.name.trim(),
        phone: values.phone?.trim() ? values.phone.trim() : null,
        avatar: values.avatar ?? null,
        removeAvatar: removeAvatar && !values.avatar,
      }).unwrap();
      showSuccess('Perfil atualizado');
      setRemoveAvatar(false);
      setValue('avatar', undefined, { shouldDirty: false });
    } catch (err) {
      const message =
        (err as AppErrorResult)?.data?.message ?? 'Erro ao atualizar perfil';
      showError(message);
    }
  };

  const handleCancel = () => {
    reset(buildDefaultValues(user?.name, user?.phone));
    setRemoveAvatar(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        <Controller
          control={control}
          name="avatar"
          render={({ field, fieldState }) => (
            <ProfileAvatarPicker
              currentAvatarUrl={user?.avatar_url}
              fallbackName={user?.name}
              fallbackEmail={user?.email}
              file={field.value ?? null}
              removed={removeAvatar}
              errorMessage={fieldState.error?.message}
              disabled={isLoading}
              onFileChange={(file) => {
                field.onChange(file ?? undefined);
                if (file) setRemoveAvatar(false);
              }}
              onRemove={() => setRemoveAvatar(true)}
              onUndoRemove={() => setRemoveAvatar(false)}
            />
          )}
        />

        <Divider />

        <TextField
          label="Nome"
          autoComplete="name"
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          disabled={isLoading}
        />
        <TextField
          label="Telefone"
          autoComplete="tel"
          fullWidth
          placeholder="+55 11 99999-9999"
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message ?? 'Opcional'}
          disabled={isLoading}
        />
        <TextField
          label="Email"
          value={user?.email ?? ''}
          fullWidth
          disabled
          helperText="O email não pode ser alterado por aqui."
        />

        <div className="flex flex-row justify-end gap-2">
          <Button
            variant="text"
            onClick={handleCancel}
            disabled={isLoading || (!isDirty && !hasAvatarChange)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit}
          >
            {isLoading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
