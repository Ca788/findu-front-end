'use client';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/AddOutlined';
import { PageHeader } from '@/components/common/PageHeader';

interface BudgetsHeaderProps {
  onCreate: () => void;
}

export function BudgetsHeader({ onCreate }: BudgetsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Financeiro"
      title="Orçamentos"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          className="w-full sm:w-auto"
        >
          Novo orçamento
        </Button>
      }
    />
  );
}
