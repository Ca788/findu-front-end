'use client';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import { useCategories } from '@/features/categories/hooks/useCategories';
import {
  DEFAULT_ENTRY_FILTERS,
  hasActiveEntryFilters,
  type EntryFilterSource,
  type EntryFilterStatus,
  type EntryFilterType,
  type StatementEntryFilters,
} from '@/features/statements/models/entryFilters.model';

interface StatementEntriesFiltersProps {
  filters: StatementEntryFilters;
  onChange: (next: StatementEntryFilters) => void;
  resultCount: number;
  totalCount: number;
}

const toggleSx = {
  flex: 1,
  minWidth: 0,
  px: { xs: 0.75, sm: 1.5 },
  fontSize: { xs: '0.7rem', sm: '0.8125rem' },
  whiteSpace: 'nowrap' as const,
};

export function StatementEntriesFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
}: StatementEntriesFiltersProps) {
  const { data: categoriesData } = useCategories({ page: 1, perPage: 50 });
  const categories = categoriesData?.data ?? [];
  const active = hasActiveEntryFilters(filters);

  const patch = <K extends keyof StatementEntryFilters>(
    key: K,
    value: StatementEntryFilters[K],
  ) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-black/5 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
      <ToggleButtonGroup
        exclusive
        size="small"
        fullWidth
        value={filters.status}
        onChange={(_, next: EntryFilterStatus | null) => next && patch('status', next)}
      >
        <ToggleButton value="all" sx={toggleSx}>
          Todos
        </ToggleButton>
        <ToggleButton value="pending" sx={toggleSx}>
          Pendentes
        </ToggleButton>
        <ToggleButton value="paid" sx={toggleSx}>
          Pagos
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        exclusive
        size="small"
        fullWidth
        value={filters.transaction_type}
        onChange={(_, next: EntryFilterType | null) =>
          next && patch('transaction_type', next)
        }
      >
        <ToggleButton value="all" sx={toggleSx}>
          Tipo
        </ToggleButton>
        <ToggleButton value="expense" color="error" sx={toggleSx}>
          Despesa
        </ToggleButton>
        <ToggleButton value="income" color="success" sx={toggleSx}>
          Receita
        </ToggleButton>
      </ToggleButtonGroup>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <TextField
          select
          size="small"
          label="Origem"
          value={filters.source}
          onChange={(event) => patch('source', event.target.value as EntryFilterSource)}
          fullWidth
        >
          <MenuItem value="all">Todas</MenuItem>
          <MenuItem value="manual">Manual</MenuItem>
          <MenuItem value="recurrence">Recorrente</MenuItem>
          <MenuItem value="installment">Parcelamento</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Categoria"
          value={filters.category_id}
          onChange={(event) => patch('category_id', event.target.value)}
          fullWidth
        >
          <MenuItem value="">Todas</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          label="Buscar"
          placeholder="Descrição..."
          value={filters.search}
          onChange={(event) => patch('search', event.target.value)}
          fullWidth
          slotProps={{ htmlInput: { enterKeyHint: 'search' } }}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-black/60 dark:text-white/60">
          {active
            ? `Mostrando ${resultCount} de ${totalCount}`
            : `${totalCount} lançamento(s)`}
        </span>
        {active && (
          <Button size="small" onClick={() => onChange(DEFAULT_ENTRY_FILTERS)}>
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
