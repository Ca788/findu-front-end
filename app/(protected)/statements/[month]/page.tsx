import { PageContent } from '@/components/layout/PageContent';
import { StatementDetailPage } from '@/features/statements/components/StatementDetailPage';

interface PageProps {
  params: Promise<{ month: string }>;
}

export default async function Page({ params }: PageProps) {
  const { month } = await params;

  return (
    <PageContent>
      <StatementDetailPage month={month} />
    </PageContent>
  );
}
