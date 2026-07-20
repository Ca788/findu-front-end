import { PageContent } from '@/components/layout/PageContent';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';

export default function Page() {
  return (
    <PageContent maxWidth="md">
      <DashboardPage />
    </PageContent>
  );
}
