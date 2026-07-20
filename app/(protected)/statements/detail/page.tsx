'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { PageContent } from '@/components/layout/PageContent';
import { StatementDetailPage } from '@/features/statements/components/StatementDetailPage';

function StatementDetailRoute() {
  const searchParams = useSearchParams();
  const month = searchParams.get('month') ?? '';

  if (!month) {
    return (
      <PageContent>
        <Box className="flex justify-center py-12">
          <CircularProgress />
        </Box>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <StatementDetailPage month={month} />
    </PageContent>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <PageContent>
          <Box className="flex justify-center py-12">
            <CircularProgress />
          </Box>
        </PageContent>
      }
    >
      <StatementDetailRoute />
    </Suspense>
  );
}
