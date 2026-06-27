import { ReactNode } from 'react';
import { AuthGuard } from '@/guards/AuthGuard';
import { AppShell } from '@/components/layout/app-shell/AppShell';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
