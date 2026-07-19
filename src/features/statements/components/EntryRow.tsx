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

function SourceChip({
  source,
  installment,
}: {
  source: Transaction['source'];
  installment?: number | null;
}) {
  if (source === 'recurrence') {
    return (
      <Chip
        size="small"
        icon={<RepeatIcon fontSize="small" />}
        label="Recorrente"
        variant="outlined"
      />
    );
  }
  if (source === 'installment') {
    return (
      <Chip
        size="small"
        icon={<PaymentsIcon fontSize="small" />}
        label={installment ? `${installment}ª` : 'Parc.'}
        variant="outlined"
      />
    );
  }
  return null;
}

export function EntryRow({
  entry,
  onToggle,
  onEdit,
  onDelete,
  isToggling,
}: EntryRowProps) {
  const paid = entry.status === 'paid';
  const amount = Number(entry.amount);
  const amountColor = entry.transaction_type === 'income' ? 'success.main' : 'error.main';

  return (
    <div className="flex items-start gap-2 rounded-2xl border border-black/5 bg-white/70 px-2.5 py-2.5 dark:border-white/10 dark:bg-white/5 sm:items-center sm:gap-3 sm:px-3">
      <Checkbox
        checked={paid}
        onChange={() => onToggle(entry)}
        disabled={isToggling}
        sx={{ mt: { xs: -0.25, sm: 0 }, p: 0.75 }}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              textDecoration: paid ? 'line-through' : 'none',
              color: paid ? 'text.disabled' : 'text.primary',
              lineHeight: 1.3,
            }}
            className="min-w-0 break-words"
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
        <Typography
          variant="body2"
          className="sm:hidden"
          sx={{
            color: paid ? 'text.disabled' : amountColor,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            textDecoration: paid ? 'line-through' : 'none',
            mt: 0.25,
          }}
        >
          {entry.transaction_type === 'expense' ? '- ' : '+ '}
          {formatBRL(amount)}
        </Typography>
      </div>

      <Typography
        variant="body1"
        className="hidden sm:block"
        sx={{
          color: paid ? 'text.disabled' : amountColor,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          textDecoration: paid ? 'line-through' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {entry.transaction_type === 'expense' ? '- ' : '+ '}
        {formatBRL(amount)}
      </Typography>

      <div className="flex shrink-0 items-center">
        <IconButton
          size="small"
          onClick={() => onEdit(entry)}
          aria-label="Editar"
          sx={{ touchAction: 'manipulation' }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(entry)}
          aria-label="Excluir"
          sx={{ touchAction: 'manipulation' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
}
