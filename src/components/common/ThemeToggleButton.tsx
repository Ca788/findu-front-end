'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import { useThemeMode } from '@/providers/MuiProvider';

export function ThemeToggleButton() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';
  const label = isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro';

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={toggleMode}
        aria-label={label}
        size="small"
      >
        {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
