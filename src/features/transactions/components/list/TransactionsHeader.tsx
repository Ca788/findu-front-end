'use client';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/AddOutlined';
import { PageHeader } from '@/components/common/PageHeader';

interface TransactionsHeaderProps {
  onCreate: () => void;
}

export function TransactionsHeader({ onCreate }: TransactionsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Financeiro"
      title="Transações"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          className="w-full sm:w-auto"
        >
          Nova transação
        </Button>
      }
    />
  );
}
