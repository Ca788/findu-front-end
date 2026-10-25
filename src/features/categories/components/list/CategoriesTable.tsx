'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { EmptyState } from '@/components/common/EmptyState';
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
            <TableCell>WhatsApp</TableCell>
            <TableCell align="right" width={120}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty && (
            <TableRow>
              <TableCell colSpan={3} className="py-8">
                <EmptyState
                  illustration="briefcase"
                  size={110}
                  title="Nenhuma categoria ainda"
                  description="Crie categorias como Mercado, Transporte ou Lazer para organizar os lançamentos."
                />
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
