'use client';

import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Typography from '@mui/material/Typography';
import RepeatIcon from '@mui/icons-material/RepeatOutlined';
import PaymentsIcon from '@mui/icons-material/PaymentsOutlined';
import { formatBRL } from '@/utils/currency';
import type { Transaction } from '@/features/transactions/models/transaction.model';

interface EntryRowProps {
  entry: Transaction;
  onToggle: (entry: Transaction) => void;
  onEdit: (entry: Transaction) => void;
  onDelete: (entry: Transaction) => void;
  isToggling?: boolean;
}

function SourceChip({ source, installment }: { source: Transaction['source']; installment?: number | null }) {
  if (source === 'recurrence') {
    return <Chip size="small" icon={<RepeatIcon fontSize="small" />} label="Recorrente" variant="outlined" />;
  }
  if (source === 'installment') {
    return (
      <Chip
        size="small"
        icon={<PaymentsIcon fontSize="small" />}
        label={installment ? `Parcela ${installment}` : 'Parcelamento'}
        variant="outlined"
      />
    );
  }
  return null;
}

export function EntryRow({ entry, onToggle, onEdit, onDelete, isToggling }: EntryRowProps) {
  const paid = entry.status === 'paid';
  const amount = Number(entry.amount);
  const amountColor = entry.transaction_type === 'income' ? 'success.main' : 'error.main';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-white/5">
      <Checkbox
        checked={paid}
        onChange={() => onToggle(entry)}
        disabled={isToggling}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              textDecoration: paid ? 'line-through' : 'none',
              color: paid ? 'text.disabled' : 'text.primary',
            }}
            className="truncate"
          >
            {entry.description || 'Sem descrição'}
          </Typography>
          <SourceChip source={entry.source} installment={entry.installment_number} />
        </div>
        {entry.category?.name && (
          <Typography variant="caption" color="text.secondary">
            {entry.category.name}
          </Typography>
        )}
      </div>
      <Typography
        variant="body1"
        sx={{
          color: paid ? 'text.disabled' : amountColor,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          textDecoration: paid ? 'line-through' : 'none',
        }}
      >
        {entry.transaction_type === 'expense' ? '- ' : '+ '}
        {formatBRL(amount)}
      </Typography>
      <IconButton size="small" onClick={() => onEdit(entry)} aria-label="Editar">
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => onDelete(entry)} aria-label="Excluir">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
