import { useCallback, useState } from 'react';
import type { Transaction } from '@/features/transactions/models/transaction.model';

type DialogMode = 'closed' | 'form' | 'delete';

interface DialogState {
  mode: DialogMode;
  selected?: Transaction;
}

const CLOSED: DialogState = { mode: 'closed', selected: undefined };

export function useTransactionDialogs() {
  const [state, setState] = useState<DialogState>(CLOSED);

  const openCreate = useCallback(
    () => setState({ mode: 'form', selected: undefined }),
    [],
  );
  const openEdit = useCallback(
    (transaction: Transaction) => setState({ mode: 'form', selected: transaction }),
    [],
  );
  const openDelete = useCallback(
    (transaction: Transaction) => setState({ mode: 'delete', selected: transaction }),
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
