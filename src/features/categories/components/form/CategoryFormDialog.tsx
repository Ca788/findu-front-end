'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useCreateCategory } from '@/features/categories/hooks/useCreateCategory';
import { useUpdateCategory } from '@/features/categories/hooks/useUpdateCategory';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { FormDialog } from '@/components/common/FormDialog';
import {
  AppErrorResultMapper,
  type ErrorResponse,
} from '@/infrastructure/AppResponse';
import type { Category } from '@/features/categories/models/category.model';
import {
  categoryFormSchema,
  type CategoryFormValues,
} from '@/features/categories/components/form/categoryFormSchema';
import { CategoryFormFields } from '@/features/categories/components/form/CategoryFormFields';

interface CategoryFormDialogProps {
  open: boolean;
  category?: Category;
  onClose: () => void;
}

export function CategoryFormDialog({
  open,
  category,
  onClose,
}: CategoryFormDialogProps) {
  const isEdit = !!category;
  const { showSuccess, showError } = useSnackbar();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) reset({ name: category?.name ?? '' });
  }, [open, category, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (isEdit && category) {
        await updateMutation.mutateAsync({ id: category.id, input: values });
        showSuccess('Categoria atualizada');
      } else {
        await createMutation.mutateAsync(values);
        showSuccess('Categoria criada');
      }
      onClose();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(
        err as AxiosError<ErrorResponse>,
      );
      showError(mapped.data.message ?? 'Erro ao salvar categoria');
    }
  };

  return (
    <FormDialog
      open={open}
      title={isEdit ? 'Editar categoria' : 'Nova categoria'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      maxWidth="xs"
    >
      <CategoryFormFields register={register} errors={errors} />
    </FormDialog>
  );
}
