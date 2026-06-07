'use client';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/AddOutlined';

interface CategoriesHeaderProps {
  onCreate: () => void;
}

export function CategoriesHeader({ onCreate }: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        className="w-full shrink-0 sm:w-auto"
      >
        Nova categoria
      </Button>
    </div>
  );
}
