'use client';

import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVertRounded';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Box from '@mui/material/Box';
import { formatBRL } from '@/utils/currency';
import type { Transaction } from '@/features/transactions/models/transaction.model';

interface EntryRowProps {
  entry: Transaction;
  onToggle: (entry: Transaction) => void;
  onEdit: (entry: Transaction) => void;
  onDelete: (entry: Transaction) => void;
  isToggling?: boolean;
}

function sourceLabel(entry: Transaction): string | null {
  if (entry.source === 'recurrence') return 'Recorrente';
  if (entry.source === 'installment') {
    return entry.installment_number ? `${entry.installment_number}ª parc.` : 'Parcela';
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
  const source = sourceLabel(entry);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.25,
        py: 1.25,
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Checkbox
        checked={paid}
        onChange={() => onToggle(entry)}
        disabled={isToggling}
        sx={{ p: 0.75 }}
        slotProps={{
          input: {
            'aria-label': paid ? 'Marcar pendente' : 'Marcar pago',
          },
        }}
      />

      <Box
        role="button"
        tabIndex={0}
        onClick={() => onEdit(entry)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onEdit(entry);
          }
        }}
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              textDecoration: paid ? 'line-through' : 'none',
              color: paid ? 'text.disabled' : 'text.primary',
              lineHeight: 1.3,
            }}
            className="truncate"
          >
            {entry.description || 'Sem descrição'}
          </Typography>
          <Typography variant="caption" color="text.secondary" className="truncate block">
            {[entry.category?.name, source].filter(Boolean).join(' · ') || 'Manual'}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            flexShrink: 0,
            whiteSpace: 'nowrap',
            color: paid ? 'text.disabled' : amountColor,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            textDecoration: paid ? 'line-through' : 'none',
          }}
        >
          {entry.transaction_type === 'expense' ? '−' : '+'}
          {formatBRL(amount)}
        </Typography>
      </Box>

      <IconButton
        size="small"
        aria-label="Mais opções"
        onClick={(event) => setMenuAnchor(event.currentTarget)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            onDelete(entry);
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
