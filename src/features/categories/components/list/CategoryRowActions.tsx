'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

interface CategoryRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryRowActions({ onEdit, onDelete }: CategoryRowActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Tooltip title="Editar">
        <IconButton size="small" onClick={onEdit} aria-label="Editar categoria">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Remover">
        <IconButton size="small" onClick={onDelete} aria-label="Remover categoria">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
