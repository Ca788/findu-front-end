import { ReactNode } from 'react';
import { AuthGuard } from '@/guards/AuthGuard';
import { ProtectedShell } from '@/components/layout/ProtectedShell';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <ProtectedShell>{children}</ProtectedShell>
    </AuthGuard>
  );
}
