import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import SavingsIcon from '@mui/icons-material/SavingsOutlined';
import PieChartIcon from '@mui/icons-material/PieChartOutlined';
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
    href: AppRoutePaths.CHAT,
    icon: ChatIcon,
    section: 'primary',
    exact: true,
  },
  {
    label: 'Histórico',
    href: APP_CHAT_HISTORY_PATH,
    icon: HistoryIcon,
    section: 'primary',
  },
  {
    label: 'Dashboard',
    href: AppRoutePaths.DASHBOARD,
    icon: DashboardIcon,
    section: 'secondary',
  },
  {
    label: 'Transações',
    href: AppRoutePaths.TRANSACTIONS,
    icon: ReceiptLongIcon,
    section: 'secondary',
  },
  {
    label: 'Categorias',
    href: AppRoutePaths.CATEGORIES,
    icon: CategoryIcon,
    section: 'secondary',
  },
  {
    label: 'Orçamentos',
    href: AppRoutePaths.BUDGETS,
    icon: SavingsIcon,
    section: 'secondary',
  },
  {
    label: 'Resumo',
    href: AppRoutePaths.SUMMARY,
    icon: PieChartIcon,
    section: 'secondary',
  },
];

export function findActiveNavItem(pathname: string): AppNavItem | undefined {
  const ordered = [...appNavItems].sort((a, b) => b.href.length - a.href.length);
  return ordered.find((item) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
}
