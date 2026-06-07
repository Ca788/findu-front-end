'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export function RowActions({
  onEdit,
  onDelete,
  editLabel = 'Editar',
  deleteLabel = 'Remover',
}: RowActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Tooltip title={editLabel}>
        <IconButton size="small" onClick={onEdit} aria-label={editLabel}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={deleteLabel}>
        <IconButton size="small" onClick={onDelete} aria-label={deleteLabel}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
