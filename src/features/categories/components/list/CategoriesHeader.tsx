'use client';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/AddOutlined';

interface CategoriesHeaderProps {
  onCreate: () => void;
}

export function CategoriesHeader({ onCreate }: CategoriesHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Typography variant="overline" color="text.secondary">
          Financeiro
        </Typography>
        <Typography variant="h5" component="h2" className="font-semibold">
          Categorias
        </Typography>
      </div>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreate}
        className="shrink-0"
      >
        Nova categoria
      </Button>
    </div>
  );
}
