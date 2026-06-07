'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Category } from '@/features/categories/models/category.model';
import { CategoryRow } from '@/features/categories/components/list/CategoryRow';

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const isEmpty = !isLoading && categories.length === 0;

  return (
    <TableContainer component={Paper} className="rounded-2xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell align="right" width={120}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty && (
            <TableRow>
              <TableCell colSpan={2} align="center" className="py-10">
                <Typography variant="body2" color="text.secondary">
                  Nenhuma categoria cadastrada.
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
