'use client';

import { useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircleOutlined';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { AppRoutePaths } from '@/constants/AppRoutePaths';
import { getInitials } from '@/utils/initials';
import { UserAvatarButton } from '@/components/common/UserAvatarButton';
import { UserMenuHeader } from '@/components/common/UserMenuHeader';

const MENU_ID = 'user-menu';

export function UserMenu() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { logout, isLoading } = useLogout();
  const { showSuccess, showError } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const open = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const close = () => setAnchorEl(null);

  const handleProfile = () => {
    close();
    router.push(AppRoutePaths.PROFILE);
  };

  const handleLogout = async () => {
    close();
    try {
      await logout().unwrap();
      showSuccess('Sessão encerrada');
    } catch {
      showError('Erro ao encerrar sessão');
    } finally {
      router.replace(AppRoutePaths.LOGIN);
    }
  };

  return (
    <>
      <UserAvatarButton
        initials={getInitials(user?.name, user?.email)}
        avatarUrl={user?.avatar_url}
        onClick={open}
        expanded={isOpen}
        controls={MENU_ID}
      />
      <Menu
        id={MENU_ID}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={close}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { className: 'mt-1.5 min-w-[220px]' } }}
      >
        <UserMenuHeader name={user?.name} email={user?.email} />
        <Divider />
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} disabled={isLoading}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {isLoading ? 'Saindo...' : 'Sair'}
        </MenuItem>
      </Menu>
    </>
  );
}
