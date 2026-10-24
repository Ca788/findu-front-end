'use client';

import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/AddOutlined';
import { AxiosError } from 'axios';
import { ListSkeleton } from '@/components/common/ListSkeleton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataPagination } from '@/components/common/DataPagination';
import { PageHeader } from '@/components/common/PageHeader';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppErrorResultMapper, type ErrorResponse } from '@/infrastructure/AppResponse';
import { formatBRL } from '@/utils/currency';
import { useArchiveBox, useBoxDialogs, useBoxes } from '@/features/boxes/hooks/useBoxes';
import { BoxCard } from '@/features/boxes/components/BoxCard';
import { BoxDetailDialog } from '@/features/boxes/components/BoxDetailDialog';
import { BoxFormDialog } from '@/features/boxes/components/BoxFormDialog';
import { BoxIllustrationView } from '@/features/boxes/components/BoxIllustrationView';
import { BoxMoveDialog } from '@/features/boxes/components/BoxMoveDialog';
import {
  BOX_KIND_LABELS,
  BOX_KINDS,
  type Box as BoxModel,
  type BoxKind,
} from '@/features/boxes/models/box.model';

const EMPTY_BOXES: BoxModel[] = [];

export function BoxesPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [kind, setKind] = useState<BoxKind | undefined>();
  const [archived, setArchived] = useState(false);
  const [celebratingId, setCelebratingId] = useState<string | undefined>();
  const dialogs = useBoxDialogs();
  const { showSuccess, showError } = useSnackbar();
  const archiveMutation = useArchiveBox();
  const { data, isLoading, isError } = useBoxes({ page, perPage, kind, archived });

  const boxes = data?.data ?? EMPTY_BOXES;
  const totalCount = data?.pagination.totalCount ?? 0;
  const selected = useMemo(
    () => boxes.find((item) => item.id === dialogs.selected?.id) ?? dialogs.selected,
    [boxes, dialogs.selected],
  );

  const totals = useMemo(() => {
    const balance = boxes.reduce((sum, item) => sum + Number(item.balance), 0);
    const withTarget = boxes.filter((item) => item.target_amount && Number(item.target_amount) > 0);
    const completed = withTarget.filter((item) => (item.progress_percent ?? 0) >= 100).length;
    return { balance, withTarget: withTarget.length, completed };
  }, [boxes]);

  useEffect(() => {
    if (!celebratingId) return;
    const timer = window.setTimeout(() => setCelebratingId(undefined), 800);
    return () => window.clearTimeout(timer);
  }, [celebratingId]);

  const handleArchive = async () => {
    if (!dialogs.selected) return;
    try {
      const restore = dialogs.selected.archived;
      await archiveMutation.mutateAsync({ id: dialogs.selected.id, restore });
      showSuccess(restore ? 'Caixinha restaurada' : 'Caixinha arquivada');
      dialogs.close();
    } catch (err) {
      const mapped = AppErrorResultMapper.fromAxiosError(err as AxiosError<ErrorResponse>);
      showError(mapped.data.message ?? 'Erro ao arquivar caixinha');
    }
  };

  const changeFilter = (next: BoxKind | undefined) => {
    setKind(next);
    setPage(1);
  };

  const toggleArchived = () => {
    setArchived((prev) => !prev);
    setPage(1);
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Financeiro"
        title="Caixinhas"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={dialogs.openCreate}
            className="w-full sm:w-auto"
          >
            Nova caixinha
          </Button>
        }
      />

      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: 2.5,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        })}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
          <BoxIllustrationView illustrationKey="coins" size={88} />
          <Stack spacing={0.25} sx={{ flex: 1 }}>
            <Typography variant="overline" color="text.secondary">
              {archived ? 'Arquivadas nesta página' : 'Guardado nesta página'}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {formatBRL(totals.balance)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {boxes.length} {boxes.length === 1 ? 'caixinha' : 'caixinhas'}
              {totals.withTarget > 0 && ` · ${totals.completed}/${totals.withTarget} metas atingidas`}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Chip
          label="Todas"
          color={!kind ? 'primary' : 'default'}
          variant={!kind ? 'filled' : 'outlined'}
          onClick={() => changeFilter(undefined)}
        />
        {BOX_KINDS.map((item) => (
          <Chip
            key={item}
            label={BOX_KIND_LABELS[item]}
            color={kind === item ? 'primary' : 'default'}
            variant={kind === item ? 'filled' : 'outlined'}
            onClick={() => changeFilter(item)}
          />
        ))}
        <Chip
          label="Arquivadas"
          color={archived ? 'secondary' : 'default'}
          variant={archived ? 'filled' : 'outlined'}
          onClick={toggleArchived}
        />
      </Stack>

      {isError && <Alert severity="error">Erro ao carregar caixinhas.</Alert>}
      {isLoading ? (
        <ListSkeleton rows={6} height={180} columns={2} />
      ) : boxes.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
            <BoxIllustrationView illustrationKey="piggy" size={140} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {archived ? 'Nenhuma caixinha arquivada' : 'Comece a guardar'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
              {archived
                ? 'Caixinhas arquivadas aparecem aqui.'
                : 'Crie uma caixinha para a reserva de emergência, uma viagem ou qualquer objetivo.'}
            </Typography>
            {!archived && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={dialogs.openCreate}>
                Criar primeira caixinha
              </Button>
            )}
          </Stack>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {boxes.map((item) => (
            <BoxCard
              key={item.id}
              box={item}
              celebrate={celebratingId === item.id}
              onOpen={dialogs.openDetail}
              onMove={dialogs.openMove}
            />
          ))}
        </Box>
      )}

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
          perPageOptions={[12, 24, 48]}
        />
      )}

      <BoxFormDialog
        open={dialogs.mode === 'form'}
        box={selected}
        onClose={dialogs.close}
        onCreated={(created) => setCelebratingId(created.id)}
      />
      <BoxMoveDialog
        open={dialogs.mode === 'move'}
        box={selected}
        onClose={dialogs.close}
        onMoved={(result) => {
          if (result.movement.kind === 'deposit') setCelebratingId(result.box.id);
        }}
      />
      <BoxDetailDialog
        open={dialogs.mode === 'detail'}
        box={selected}
        onClose={dialogs.close}
        onEdit={dialogs.openEdit}
        onMove={dialogs.openMove}
        onArchive={dialogs.openArchive}
      />
      <ConfirmDialog
        open={dialogs.mode === 'archive'}
        title={selected?.archived ? 'Restaurar caixinha' : 'Arquivar caixinha'}
        description={
          selected?.archived
            ? `Restaurar "${selected?.name}" para a lista de caixinhas ativas?`
            : `Arquivar "${selected?.name}"? Só é possível arquivar caixinhas com saldo zero.`
        }
        confirmLabel={selected?.archived ? 'Restaurar' : 'Arquivar'}
        confirmColor={selected?.archived ? 'primary' : 'warning'}
        isLoading={archiveMutation.isPending}
        onClose={dialogs.close}
        onConfirm={handleArchive}
      />
    </Stack>
  );
}
