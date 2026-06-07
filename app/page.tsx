import { PageContainer } from '@/components/layout/PageContainer';
import { LoginScreen } from '@/features/auth/components/login/LoginScreen';

export default function Home() {
  return (
    <PageContainer contentClassName="w-full max-w-md">
      <LoginScreen />
    </PageContainer>
  );
}
