import type { SvgIconComponent } from '@mui/icons-material';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import type {
  AppNotification,
  NotificationGroup,
} from '@/features/notifications/models/notification.model';

interface GroupPresentation {
  icon: SvgIconComponent;
  color: string;
}

export const NOTIFICATION_GROUP_PRESENTATION: Record<NotificationGroup, GroupPresentation> = {
  entries_due: { icon: EventOutlinedIcon, color: '#F59E0B' },
  budgets: { icon: SavingsOutlinedIcon, color: '#EF4444' },
  insights: { icon: AutoAwesomeOutlinedIcon, color: '#8B5CF6' },
  installments: { icon: CreditScoreOutlinedIcon, color: '#10B981' },
  reminders: { icon: NotificationsActiveOutlinedIcon, color: '#2F6BFF' },
};

export function notificationHref(data: AppNotification['data']): string {
  const { route, month } = data;
  if (route === AppRoutePaths.STATEMENTS_DETAIL && month) {
    return AppRoutePaths.statementDetail(month);
  }
  return route ?? AppRoutePaths.DASHBOARD;
}

const RELATIVE = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

export function formatRelativeTime(iso: string, now = Date.now()): string {
  const diffMs = new Date(iso).getTime() - now;
  const minutes = Math.round(diffMs / 60_000);
  if (Math.abs(minutes) < 60) return RELATIVE.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return RELATIVE.format(hours, 'hour');
  return RELATIVE.format(Math.round(hours / 24), 'day');
}
