'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CategoryBreakdownItem } from '@/features/summary/components/CategoryBreakdownItem';
import type { Summary } from '@/features/summary/models/summary.model';

interface CategoryBreakdownProps {
  summary?: Summary;
}

export function CategoryBreakdown({ summary }: CategoryBreakdownProps) {
  const entries = summary?.by_category ?? [];
  const total = entries.reduce((sum, entry) => sum + Number(entry.amount), 0);

  return (
    <Paper className="rounded-2xl px-4 py-4 md:px-6 md:py-5">
      <Typography variant="subtitle1" className="font-semibold">
        Por categoria
      </Typography>
      <Typography variant="caption" color="text.secondary" component="div">
        Distribuição das transações no período selecionado.
      </Typography>

      {entries.length === 0 ? (
        <Typography variant="body2" color="text.secondary" className="mt-4 text-center">
          Nenhuma transação no período.
        </Typography>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {entries.map((entry, index) => (
            <CategoryBreakdownItem
              key={`${entry.category_id ?? 'none'}-${index}`}
              entry={entry}
              total={total}
            />
          ))}
        </div>
      )}
    </Paper>
  );
}
