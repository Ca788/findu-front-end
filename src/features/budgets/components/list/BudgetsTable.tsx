'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { Budget } from '@/features/budgets/models/budget.model';
import { BudgetRow } from '@/features/budgets/components/list/BudgetRow';
import { EmptyState } from '@/components/common/EmptyState';

interface BudgetsTableProps {
  budgets: Budget[];
  isLoading: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export function BudgetsTable({ budgets, isLoading, onEdit, onDelete }: BudgetsTableProps) {
  const isEmpty = !isLoading && budgets.length === 0;

  return (
    <TableContainer component={Paper} className="rounded-2xl">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Período</TableCell>
            <TableCell>Intervalo</TableCell>
            <TableCell>Uso</TableCell>
            <TableCell align="right" width={120}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty && (
            <TableRow>
              <TableCell colSpan={4} className="py-8">
                <EmptyState
                  illustration="shield"
                  size={110}
                  title="Nenhum orçamento ainda"
                  description="Defina um limite por período e acompanhe o consumo em tempo real."
                />
              </TableCell>
            </TableRow>
          )}
          {budgets.map((budget) => (
            <BudgetRow
              key={budget.id}
              budget={budget}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
