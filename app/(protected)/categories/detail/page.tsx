'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { PageContent } from '@/components/layout/PageContent';
import { CategoryDetailPage } from '@/features/categories/components/detail/CategoryDetailPage';

function CategoryDetailRoute() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const month = searchParams.get('from') ?? searchParams.get('to') ?? undefined;

  if (!id) {
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
      <CategoryDetailPage categoryId={id} month={month ?? undefined} />
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
      <CategoryDetailRoute />
    </Suspense>
  );
}
