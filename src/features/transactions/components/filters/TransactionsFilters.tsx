'use client';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/ClearOutlined';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type {
  TransactionListFilters,
  TransactionType,
} from '@/features/transactions/models/transaction.model';

interface TransactionsFiltersProps {
  filters: TransactionListFilters;
  onChange: <K extends keyof TransactionListFilters>(
    key: K,
    value: TransactionListFilters[K] | undefined,
  ) => void;
  onReset: () => void;
  hasFilters: boolean;
}

const FIELD_CLASS = 'min-w-[140px]';

export function TransactionsFilters({
  filters,
  onChange,
  onReset,
  hasFilters,
}: TransactionsFiltersProps) {
  const { data } = useCategories({ page: 1, perPage: 50 });
  const categories = data?.data ?? [];

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
      <TextField
        select
        label="Tipo"
        size="small"
        className={FIELD_CLASS}
        value={filters.transaction_type ?? ''}
        onChange={(e) =>
          onChange(
            'transaction_type',
            (e.target.value || undefined) as TransactionType | undefined,
          )
        }
      >
        <MenuItem value="">Todos</MenuItem>
        <MenuItem value="expense">Despesa</MenuItem>
        <MenuItem value="income">Receita</MenuItem>
      </TextField>

      <TextField
        select
        label="Categoria"
        size="small"
        className={FIELD_CLASS}
        value={filters.category_id ?? ''}
        onChange={(e) => onChange('category_id', e.target.value || undefined)}
      >
        <MenuItem value="">Todas</MenuItem>
        {categories.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="De"
        type="date"
        size="small"
        className={FIELD_CLASS}
        slotProps={{ inputLabel: { shrink: true } }}
        value={filters.from ?? ''}
        onChange={(e) => onChange('from', e.target.value || undefined)}
      />

      <TextField
        label="Até"
        type="date"
        size="small"
        className={FIELD_CLASS}
        slotProps={{ inputLabel: { shrink: true } }}
        value={filters.to ?? ''}
        onChange={(e) => onChange('to', e.target.value || undefined)}
      />

      {hasFilters && (
        <Button
          variant="text"
          startIcon={<ClearIcon />}
          onClick={onReset}
          size="small"
          className="col-span-2 self-center sm:col-auto"
        >
          Limpar
        </Button>
      )}
    </div>
  );
}
