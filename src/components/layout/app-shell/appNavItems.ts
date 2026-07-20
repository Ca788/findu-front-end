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
import PersonIcon from '@mui/icons-material/PersonOutlineOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export interface AppNavItem {
  label: string;
  href: string;
  icon: ComponentType<SvgIconProps>;
  section?: 'primary' | 'secondary';
  exact?: boolean;
}

export interface MobileTabNavItem {
  label: string;
  href: string;
  icon: ComponentType<SvgIconProps>;
  isActive: (pathname: string) => boolean;
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

export const mobileTabNavItems: MobileTabNavItem[] = [
  {
    label: 'Chat',
    href: AppRoutePaths.CHAT,
    icon: ChatIcon,
    isActive: (pathname) =>
      pathname === AppRoutePaths.CHAT || pathname.startsWith(`${AppRoutePaths.CHAT}/c`),
  },
  {
    label: 'Início',
    href: AppRoutePaths.DASHBOARD,
    icon: DashboardIcon,
    isActive: (pathname) =>
      pathname === AppRoutePaths.DASHBOARD || pathname.startsWith(`${AppRoutePaths.DASHBOARD}/`),
  },
  {
    label: 'Extratos',
    href: AppRoutePaths.STATEMENTS,
    icon: ReceiptLongIcon,
    isActive: (pathname) =>
      pathname === AppRoutePaths.STATEMENTS ||
      pathname.startsWith(`${AppRoutePaths.STATEMENTS}/`),
  },
  {
    label: 'Orçamentos',
    href: AppRoutePaths.BUDGETS,
    icon: SavingsIcon,
    isActive: (pathname) =>
      pathname === AppRoutePaths.BUDGETS || pathname.startsWith(`${AppRoutePaths.BUDGETS}/`),
  },
  {
    label: 'Perfil',
    href: AppRoutePaths.PROFILE,
    icon: PersonIcon,
    isActive: (pathname) =>
      pathname === AppRoutePaths.PROFILE || pathname.startsWith(`${AppRoutePaths.PROFILE}/`),
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
