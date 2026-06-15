'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useFloatingAgent } from '@/contexts/FloatingAgentContext';

export function DashboardChatCta() {
  const { setOpen } = useFloatingAgent();

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(60% 100% at 100% 0%, ${theme.palette.primary.main}1f 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      })}
      className="relative flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-6"
    >
      <div className="relative flex items-start gap-3">
        <AutoAwesomeIcon sx={{ color: 'primary.main', mt: 0.25 }} />
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Pergunte aos agentes do Findu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tire dúvidas, registre uma despesa por áudio ou peça um resumo do mês.
            Escolha o agente certo: analista, lançador ou faxineiro.
          </Typography>
        </div>
      </div>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, fontWeight: 600 }}
      >
        Conversar agora
      </Button>
    </Paper>
  );
}
