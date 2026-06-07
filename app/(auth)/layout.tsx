import { ReactNode } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer contentClassName="w-full max-w-md">{children}</PageContainer>
  );
}
