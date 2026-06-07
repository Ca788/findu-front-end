'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { navItems } from '@/components/layout/sidebar/navItems';

const FALLBACK_TITLE = 'FindU';

export function usePageTitle(): string {
  const pathname = usePathname();

  return useMemo(() => {
    const match = navItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
    return match?.label ?? FALLBACK_TITLE;
  }, [pathname]);
}
