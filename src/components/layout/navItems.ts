import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import SavingsIcon from '@mui/icons-material/SavingsOutlined';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PieChartIcon from '@mui/icons-material/PieChartOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<SvgIconProps>;
  comingSoon?: boolean;
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: AppRoutePaths.DASHBOARD,
    icon: DashboardIcon,
  },
  {
    label: 'Transações',
    href: AppRoutePaths.TRANSACTIONS,
    icon: ReceiptLongIcon,
  },
  {
    label: 'Categorias',
    href: AppRoutePaths.CATEGORIES,
    icon: CategoryIcon,
  },
  {
    label: 'Orçamentos',
    href: '/budgets',
    icon: SavingsIcon,
    comingSoon: true,
  },
  {
    label: 'Resumo',
    href: '/summary',
    icon: PieChartIcon,
    comingSoon: true,
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: ChatIcon,
    comingSoon: true,
  },
];
