'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';
import SendIcon from '@mui/icons-material/SendOutlined';
import { PageHeader } from '@/components/common/PageHeader';
import { DataPagination } from '@/components/common/DataPagination';
import { StatementMonthSwitcher } from '@/features/statements/components/StatementMonthSwitcher';
import { useCategory } from '@/features/categories/hooks/useCategory';
import { useCategoryTransactions } from '@/features/categories/hooks/useCategoryTransactions';
import { currentMonthParam, formatMonthParam } from '@/features/statements/utils/month';
import { formatBRL } from '@/utils/currency';
import { formatDateBR } from '@/utils/date';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type { Transaction } from '@/features/transactions/models/transaction.model';
import { ReceiptFormDialog } from '@/features/receipts/components/ReceiptFormDialog';

interface CategoryDetailPageProps {
  categoryId: string;
  month?: string;
}

function TransactionCard({ entry }: { entry: Transaction }) {
  const amountColor = entry.transaction_type === 'income' ? 'success.main' : 'error.main';
  const month = formatMonthParam(entry.competency_month);

  return (
    <Paper
      component={Link}
      href={AppRoutePaths.statementDetail(month)}
      className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 no-underline"
      sx={{ color: 'inherit' }}
    >
      <div className="min-w-0">
        <Typography variant="body2" className="truncate" sx={{ fontWeight: 600 }}>
          {entry.description || 'Sem descrição'}
        </Typography>
        <Typography variant="caption" color="text.secondary" className="truncate block">
          {[formatDateBR(entry.occurred_at), entry.payer_name].filter(Boolean).join(' · ') ||
            'Manual'}
        </Typography>
      </div>
      <Typography
        variant="body2"
        sx={{
          flexShrink: 0,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: amountColor,
        }}
      >
        {entry.transaction_type === 'expense' ? '−' : '+'}
        {formatBRL(entry.amount)}
      </Typography>
    </Paper>
  );
}

export function CategoryDetailPage({ categoryId, month: initialMonth }: CategoryDetailPageProps) {
  const router = useRouter();
  const [month, setMonth] = useState(initialMonth || currentMonthParam);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sendOpen, setSendOpen] = useState(false);

  const categoryQuery = useCategory(categoryId);
  const transactionsQuery = useCategoryTransactions({
    categoryId,
    page,
    perPage,
    from: month,
    to: month,
    view: 'extended',
  });

  const entries = transactionsQuery.data?.data ?? [];
  const totalCount = transactionsQuery.data?.pagination.totalCount ?? 0;
  const title = categoryQuery.data?.name ?? 'Categoria';

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Financeiro"
        title={title}
        actions={
          <>
            {categoryQuery.data?.whatsapp && (
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => setSendOpen(true)}
              >
                Enviar comprovante
              </Button>
            )}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push(AppRoutePaths.CATEGORIES)}
            >
              Categorias
            </Button>
          </>
        }
      />

      {categoryQuery.data?.whatsapp ? (
        <Typography variant="body2" color="text.secondary">
          WhatsApp: {categoryQuery.data.whatsapp}
        </Typography>
      ) : (
        !categoryQuery.isLoading &&
        categoryQuery.data && (
          <Alert severity="info">
            Cadastre o WhatsApp nesta categoria para enviar o comprovante do total
            pago.
          </Alert>
        )
      )}

      <StatementMonthSwitcher
        month={month}
        onChange={(next) => {
          setMonth(next);
          setPage(1);
        }}
      />

      {categoryQuery.isError && (
        <Alert severity="error">Erro ao carregar a categoria.</Alert>
      )}
      {transactionsQuery.isError && (
        <Alert severity="error">Erro ao carregar lançamentos da categoria.</Alert>
      )}
      {(categoryQuery.isFetching || transactionsQuery.isFetching) && <LinearProgress />}

      {!transactionsQuery.isFetching && entries.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhum lançamento nesta categoria no mês selecionado.
        </Typography>
      )}

      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <TransactionCard key={entry.id} entry={entry} />
        ))}
      </div>

      {totalCount > 0 && (
        <DataPagination
          page={page}
          perPage={perPage}
          totalCount={totalCount}
          onPageChange={setPage}
          onPerPageChange={(next) => {
            setPerPage(next);
            setPage(1);
          }}
        />
      )}

      <ReceiptFormDialog
        open={sendOpen}
        categoryId={categoryId}
        month={month}
        onClose={() => setSendOpen(false)}
      />
    </Stack>
  );
}
