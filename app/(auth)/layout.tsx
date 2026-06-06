import { ReactNode } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PageContainer>{children}</PageContainer>;
}
