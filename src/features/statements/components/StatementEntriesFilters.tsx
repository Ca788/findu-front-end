'use client';

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/SearchRounded';
import TuneIcon from '@mui/icons-material/TuneRounded';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useDevice } from '@/hooks/useDevice';
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

const chipSx = {
  flex: 1,
  minWidth: 0,
  px: 1,
  py: 0.75,
  borderRadius: '999px !important',
  border: '1px solid',
  borderColor: 'divider',
  fontSize: '0.8rem',
  textTransform: 'none' as const,
};

export function StatementEntriesFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
}: StatementEntriesFiltersProps) {
  const { isMobile } = useDevice();
  const { data: categoriesData } = useCategories({ page: 1, perPage: 50 });
  const categories = categoriesData?.data ?? [];
  const active = hasActiveEntryFilters(filters);
  const [advancedOpen, setAdvancedOpen] = useState(!isMobile && active);

  const patch = <K extends keyof StatementEntryFilters>(
    key: K,
    value: StatementEntryFilters[K],
  ) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col gap-2.5">
      <TextField
        size="small"
        placeholder="Buscar lançamento"
        value={filters.search}
        onChange={(event) => patch('search', event.target.value)}
        fullWidth
        slotProps={{
          htmlInput: { enterKeyHint: 'search' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': { borderRadius: 999 },
        }}
      />

      <ToggleButtonGroup
        exclusive
        size="small"
        fullWidth
        value={filters.status}
        onChange={(_, next: EntryFilterStatus | null) => next && patch('status', next)}
        sx={{ gap: 1, '& .MuiToggleButtonGroup-grouped': { margin: 0 } }}
      >
        <ToggleButton value="all" sx={chipSx}>
          Todos
        </ToggleButton>
        <ToggleButton value="pending" sx={chipSx}>
          Pendentes
        </ToggleButton>
        <ToggleButton value="paid" sx={chipSx}>
          Pagos
        </ToggleButton>
      </ToggleButtonGroup>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-black/55 dark:text-white/55">
          {active
            ? `${resultCount} de ${totalCount}`
            : `${totalCount} lançamentos`}
        </span>
        <div className="flex items-center gap-1">
          {active && (
            <Button size="small" onClick={() => onChange(DEFAULT_ENTRY_FILTERS)}>
              Limpar
            </Button>
          )}
          <Button
            size="small"
            startIcon={<TuneIcon />}
            onClick={() => setAdvancedOpen((open) => !open)}
          >
            {advancedOpen ? 'Menos' : 'Filtros'}
          </Button>
        </div>
      </div>

      <Collapse in={advancedOpen}>
        <div className="flex flex-col gap-2.5 pt-1">
          <ToggleButtonGroup
            exclusive
            size="small"
            fullWidth
            value={filters.transaction_type}
            onChange={(_, next: EntryFilterType | null) =>
              next && patch('transaction_type', next)
            }
            sx={{ gap: 1, '& .MuiToggleButtonGroup-grouped': { margin: 0 } }}
          >
            <ToggleButton value="all" sx={chipSx}>
              Todos tipos
            </ToggleButton>
            <ToggleButton value="expense" color="error" sx={chipSx}>
              Despesa
            </ToggleButton>
            <ToggleButton value="income" color="success" sx={chipSx}>
              Receita
            </ToggleButton>
          </ToggleButtonGroup>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <TextField
              select
              size="small"
              label="Origem"
              value={filters.source}
              onChange={(event) =>
                patch('source', event.target.value as EntryFilterSource)
              }
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
          </div>
        </div>
      </Collapse>
    </div>
  );
}
