'use client';

import { useDevice } from '@/hooks/useDevice';
import { DashboardDesktopHome } from '@/features/dashboard/components/DashboardDesktopHome';
import { DashboardMobileHome } from '@/features/dashboard/components/DashboardMobileHome';

export function DashboardPage() {
  const { isDesktop } = useDevice();
  return isDesktop ? <DashboardDesktopHome /> : <DashboardMobileHome />;
}
