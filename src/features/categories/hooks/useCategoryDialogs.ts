import { useCallback, useState } from 'react';
import type { Category } from '@/features/categories/models/category.model';

type DialogMode = 'closed' | 'form' | 'delete';

interface DialogState {
  mode: DialogMode;
  selected?: Category;
}

const CLOSED: DialogState = { mode: 'closed', selected: undefined };

export function useCategoryDialogs() {
  const [state, setState] = useState<DialogState>(CLOSED);

  const openCreate = useCallback(
    () => setState({ mode: 'form', selected: undefined }),
    [],
  );
  const openEdit = useCallback(
    (category: Category) => setState({ mode: 'form', selected: category }),
    [],
  );
  const openDelete = useCallback(
    (category: Category) => setState({ mode: 'delete', selected: category }),
    [],
  );
  const close = useCallback(() => setState(CLOSED), []);

  return {
    selected: state.selected,
    isFormOpen: state.mode === 'form',
    isDeleteOpen: state.mode === 'delete',
    openCreate,
    openEdit,
    openDelete,
    close,
  };
}
