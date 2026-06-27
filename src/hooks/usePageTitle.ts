'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { findActiveNavItem } from '@/components/layout/app-shell/appNavItems';

const FALLBACK_TITLE = 'Findu';

export function usePageTitle(): string {
  const pathname = usePathname();

  return useMemo(() => {
    const match = findActiveNavItem(pathname);
    return match?.label ?? FALLBACK_TITLE;
  }, [pathname]);
}
