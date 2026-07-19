import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import SavingsIcon from '@mui/icons-material/SavingsOutlined';
import ReplayIcon from '@mui/icons-material/ReplayOutlined';
import CreditScoreIcon from '@mui/icons-material/CreditScoreOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export interface AppNavItem {
  label: string;
  href: string;
  icon: ComponentType<SvgIconProps>;
  section?: 'primary' | 'secondary';
  exact?: boolean;
}

export const APP_CHAT_HISTORY_PATH = `${AppRoutePaths.CHAT}/history`;

export const appNavItems: AppNavItem[] = [
  {
    label: 'Chat',
    href: '/chat',
    icon: ChatIcon,
    section: 'primary',
    exact: true,
  },
  {
    label: 'Histórico',
    href: '/chat/history',
    icon: HistoryIcon,
    section: 'primary',
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: DashboardIcon,
    section: 'secondary',
  },
  {
    label: 'Extratos',
    href: '/statements',
    icon: ReceiptLongIcon,
    section: 'secondary',
  },
  {
    label: 'Recorrências',
    href: '/recurrences',
    icon: ReplayIcon,
    section: 'secondary',
  },
  {
    label: 'Parcelamentos',
    href: '/installments',
    icon: CreditScoreIcon,
    section: 'secondary',
  },
  {
    label: 'Categorias',
    href: '/categories',
    icon: CategoryIcon,
    section: 'secondary',
  },
  {
    label: 'Orçamentos',
    href: '/budgets',
    icon: SavingsIcon,
    section: 'secondary',
  },
];

export function findActiveNavItem(pathname: string | null | undefined): AppNavItem | undefined {
  if (!pathname) return undefined;

  const candidates = appNavItems.filter(
    (item) => typeof item.href === 'string' && item.href.length > 0,
  );

  candidates.sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0));

  return candidates.find((item) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
}
