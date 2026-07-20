'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import {
  findActiveNavItem,
  mobileTabNavItems,
} from '@/components/layout/app-shell/appNavItems';

const FALLBACK_TITLE = 'Findu';

export function usePageTitle(): string {
  const pathname = usePathname();

  return useMemo(() => {
    if (!pathname) return FALLBACK_TITLE;
    const tab = mobileTabNavItems.find((item) => item.isActive(pathname));
    if (tab) return tab.label;
    const match = findActiveNavItem(pathname);
    return match?.label ?? FALLBACK_TITLE;
  }, [pathname]);
}
