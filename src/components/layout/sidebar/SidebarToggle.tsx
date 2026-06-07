'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRightRounded';
import { useSidebar } from '@/contexts/SidebarContext';

export function SidebarToggle() {
  const { isDesktop, collapsed, toggleCollapsed } = useSidebar();

  if (!isDesktop) return null;

  const label = collapsed ? 'Expandir menu' : 'Recolher menu';

  return (
    <>
      <Divider />
      <Box className={`flex p-2 ${collapsed ? 'justify-center' : 'justify-end'}`}>
        <Tooltip title={label} placement="right">
          <IconButton onClick={toggleCollapsed} aria-label={label} size="small">
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
}
