'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/CloseRounded';
import EditIcon from '@mui/icons-material/EditOutlined';
import ArchiveIcon from '@mui/icons-material/ArchiveOutlined';
import UnarchiveIcon from '@mui/icons-material/UnarchiveOutlined';
import { DataPagination } from '@/components/common/DataPagination';
import { useDevice } from '@/hooks/useDevice';
import { formatBRL } from '@/utils/currency';
import { formatDateTimeBR } from '@/utils/date';
import { useBoxMovements } from '@/features/boxes/hooks/useBoxes';
import { BoxIllustrationView } from '@/features/boxes/components/BoxIllustrationView';
import { BoxProgressBar, boxAccent, boxProgress } from '@/features/boxes/components/BoxProgressBar';
import {
  BOX_KIND_LABELS,
  BOX_MOVEMENT_LABELS,
  type Box,
  type BoxMovement,
} from '@/features/boxes/models/box.model';

interface BoxDetailDialogProps {
  open: boolean;
  box?: Box;
  onClose: () => void;
  onEdit: (box: Box) => void;
  onMove: (box: Box) => void;
  onArchive: (box: Box) => void;
}

function movementSign(movement: BoxMovement): string {
  switch (movement.kind) {
    case 'deposit':
      return '+';
    case 'withdraw':
      return '-';
    case 'adjustment':
      return '=';
    default: {
      const exhaustive: never = movement.kind;
      return exhaustive;
    }
  }
}

export function BoxDetailDialog({ open, box, onClose, onEdit, onMove, onArchive }: BoxDetailDialogProps) {
  const { isDesktop } = useDevice();
  const [pageState, setPageState] = useState<{ boxId?: string; page: number }>({ page: 1 });
  const [perPage, setPerPage] = useState(10);
  const page = pageState.boxId === box?.id ? pageState.page : 1;
  const setPage = (next: number) => setPageState({ boxId: box?.id, page: next });
  const { data, isLoading } = useBoxMovements(open ? box?.id : undefined, { page, perPage });

  const movements = data?.data ?? [];
  const totalCount = data?.pagination.totalCount ?? 0;
  const accent = boxAccent(box ?? { color: null, illustration_key: 'piggy' });
  const { hasTarget, percent, completed } = boxProgress(box ?? {});

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={!isDesktop}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        <Typography component="span" variant="h6" noWrap sx={{ fontWeight: 700 }}>
          {box?.name}
        </Typography>
        <IconButton aria-label="Fechar" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Stack
          spacing={1}
          sx={{
            p: 3,
            alignItems: 'center',
            background: `linear-gradient(180deg, ${alpha(accent, 0.22)} 0%, transparent 100%)`,
          }}
        >
          <BoxIllustrationView illustrationKey={box?.illustration_key} size={160} />
          <Chip size="small" label={box ? BOX_KIND_LABELS[box.kind] : ''} />
          <Typography variant="h4" sx={{ color: accent, fontWeight: 800 }}>
            {formatBRL(box?.balance)}
          </Typography>
          {box && hasTarget && (
            <Stack spacing={0.5} sx={{ width: '100%', maxWidth: 360 }}>
              <BoxProgressBar box={box} height={10} />
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                {percent.toFixed(0)}% da meta de {formatBRL(box.target_amount)}
                {!completed && ` · faltam ${formatBRL(box.remaining_amount)}`}
              </Typography>
            </Stack>
          )}
          {box?.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {box.notes}
            </Typography>
          )}
        </Stack>
        <Divider />
        <Stack sx={{ px: 2, pt: 2 }} spacing={1}>
          <Typography variant="subtitle2">Extrato</Typography>
          {isLoading && <ListSkeleton rows={3} height={56} />}
          {!isLoading && movements.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhuma movimentação ainda.
            </Typography>
          )}
          <List dense disablePadding>
            {movements.map((movement) => (
              <ListItem
                key={movement.id}
                disableGutters
                secondaryAction={
                  <Typography
                    variant="body2"
                    color={movement.kind === 'withdraw' ? 'error.main' : 'text.primary'}
                    sx={{ fontWeight: 700 }}
                  >
                    {movementSign(movement)} {formatBRL(movement.amount)}
                  </Typography>
                }
              >
                <ListItemText
                  primary={movement.description || BOX_MOVEMENT_LABELS[movement.kind]}
                  secondary={`${formatDateTimeBR(movement.occurred_at)} · saldo ${formatBRL(movement.balance_after)}`}
                />
              </ListItem>
            ))}
          </List>
          {totalCount > perPage && (
            <DataPagination
              page={page}
              perPage={perPage}
              totalCount={totalCount}
              onPageChange={setPage}
              onPerPageChange={(next) => {
                setPerPage(next);
                setPage(1);
              }}
              perPageOptions={[10, 20, 50]}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5, gap: 1, flexWrap: 'wrap' }}>
        {box && (
          <>
            <Button
              startIcon={box.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
              color="inherit"
              onClick={() => onArchive(box)}
            >
              {box.archived ? 'Restaurar' : 'Arquivar'}
            </Button>
            <Button startIcon={<EditIcon />} color="inherit" onClick={() => onEdit(box)}>
              Editar
            </Button>
            <Button
              variant="contained"
              onClick={() => onMove(box)}
              disabled={box.archived}
              sx={{ bgcolor: accent, '&:hover': { bgcolor: accent, filter: 'brightness(0.92)' } }}
            >
              Guardar ou resgatar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
