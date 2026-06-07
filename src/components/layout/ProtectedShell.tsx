'use client';

import { ReactNode, useState } from 'react';
import { Sidebar, SIDEBAR_WIDTH } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

interface ProtectedShellProps {
  children: ReactNode;
}

export function ProtectedShell({ children }: ProtectedShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => setMobileOpen((prev) => !prev);
  const handleClose = () => setMobileOpen(false);

  return (
    <div className="min-h-screen md:flex">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleClose} />
      <div
        className="flex min-h-screen flex-1 flex-col"
      >
        <Topbar onMenuClick={handleToggle} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
