import { useCallback, useState } from 'react';
import type { Budget } from '@/features/budgets/models/budget.model';

type DialogMode = 'closed' | 'form' | 'delete';

interface DialogState {
  mode: DialogMode;
  selected?: Budget;
}

const CLOSED: DialogState = { mode: 'closed', selected: undefined };

export function useBudgetDialogs() {
  const [state, setState] = useState<DialogState>(CLOSED);

  const openCreate = useCallback(
    () => setState({ mode: 'form', selected: undefined }),
    [],
  );
  const openEdit = useCallback(
    (budget: Budget) => setState({ mode: 'form', selected: budget }),
    [],
  );
  const openDelete = useCallback(
    (budget: Budget) => setState({ mode: 'delete', selected: budget }),
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
