import { PageContent } from '@/components/layout/PageContent';
import { ProfilePage } from '@/features/profile/components/ProfilePage';

export default function Page() {
  return (
    <PageContent maxWidth="sm">
      <ProfilePage />
    </PageContent>
  );
}
