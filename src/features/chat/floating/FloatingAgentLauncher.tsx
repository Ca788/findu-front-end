'use client';

import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import { useFloatingAgent } from '@/contexts/FloatingAgentContext';

export function FloatingAgentLauncher() {
  const { open, toggle } = useFloatingAgent();

  return (
    <Tooltip title={open ? 'Fechar agentes' : 'Abrir agentes inteligentes'} placement="left">
      <Fab
        color="primary"
        aria-label={open ? 'Fechar chat de agentes' : 'Abrir chat de agentes'}
        onClick={toggle}
        sx={(theme) => ({
          position: 'fixed',
          right: { xs: 16, md: 24 },
          bottom: { xs: 16, md: 24 },
          zIndex: theme.zIndex.modal + 1,
          boxShadow: `0 8px 24px -4px ${theme.palette.primary.main}80`,
          transition: theme.transitions.create(['transform', 'box-shadow']),
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 16px 32px -8px ${theme.palette.primary.main}aa`,
          },
        })}
      >
        {open ? <CloseIcon /> : <AutoAwesomeIcon />}
      </Fab>
    </Tooltip>
  );
}
