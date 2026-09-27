'use client';

import { useCallback, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SouthWestIcon from '@mui/icons-material/SouthWestRounded';
import NorthEastIcon from '@mui/icons-material/NorthEastRounded';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type { Transaction } from '@/features/transactions/models/transaction.model';

const EntryFormDialog = dynamic(
  () =>
    import('@/features/statements/components/EntryFormDialog').then(
      (mod) => mod.EntryFormDialog,
    ),
  { ssr: false },
);

type EntryType = Transaction['transaction_type'];

interface DashboardQuickActionsProps {
  monthParam: string;
  variant: 'icons' | 'buttons';
}

export function DashboardQuickActions({
  monthParam,
  variant,
}: DashboardQuickActionsProps) {
  const [open, setOpen] = useState(false);
  const [entryType, setEntryType] = useState<EntryType>('expense');

  const openCreate = useCallback((type: EntryType) => {
    setEntryType(type);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {variant === 'icons' ? (
        <IconActions monthParam={monthParam} onCreate={openCreate} />
      ) : (
        <ButtonActions monthParam={monthParam} onCreate={openCreate} />
      )}
      {open ? (
        <EntryFormDialog
          open
          month={monthParam}
          initialType={entryType}
          onClose={close}
        />
      ) : null}
    </>
  );
}

function IconActions({
  monthParam,
  onCreate,
}: {
  monthParam: string;
  onCreate: (type: EntryType) => void;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 1,
      }}
    >
      <ActionIcon label="Despesa" onClick={() => onCreate('expense')}>
        <SouthWestIcon />
      </ActionIcon>
      <ActionIcon label="Receita" onClick={() => onCreate('income')}>
        <NorthEastIcon />
      </ActionIcon>
      <ActionIcon label="Comprovante" href={AppRoutePaths.RECEIPTS}>
        <PictureAsPdfIcon />
      </ActionIcon>
      <ActionIcon label="Extrato" href={AppRoutePaths.statementDetail(monthParam)}>
        <ReceiptLongIcon />
      </ActionIcon>
    </Box>
  );
}

function ActionIcon({
  label,
  href,
  onClick,
  children,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Box
      component={href ? Link : 'button'}
      href={href}
      type={href ? undefined : 'button'}
      onClick={onClick}
      sx={{
        minWidth: 0,
        minHeight: 48,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        border: 0,
        padding: 0,
        bgcolor: 'transparent',
        color: 'text.primary',
        textDecoration: 'none',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'action.hover',
          color: 'primary.main',
        }}
      >
        {children}
      </Box>
      <Typography
        component="span"
        sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2, textAlign: 'center' }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function ButtonActions({
  monthParam,
  onCreate,
}: {
  monthParam: string;
  onCreate: (type: EntryType) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-end' }}>
      <Button variant="contained" onClick={() => onCreate('expense')}>
        Despesa
      </Button>
      <Button variant="outlined" onClick={() => onCreate('income')}>
        Receita
      </Button>
      <Button component={Link} href={AppRoutePaths.RECEIPTS} variant="outlined">
        Comprovante
      </Button>
      <Button
        component={Link}
        href={AppRoutePaths.statementDetail(monthParam)}
        variant="outlined"
      >
        Extrato
      </Button>
    </Box>
  );
}
