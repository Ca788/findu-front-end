'use client';

import { type ComponentType } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeOutlined';
import QueryStatsIcon from '@mui/icons-material/QueryStatsOutlined';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import CleaningServicesIcon from '@mui/icons-material/CleaningServicesOutlined';
import { useAgents } from '@/features/chat/hooks/useAgents';
import type { Agent, AgentId } from '@/features/chat/models/agent.model';

interface AgentSelectorProps {
  selectedAgentId: AgentId | null;
  onSelect: (agentId: AgentId | null) => void;
  disabled?: boolean;
}

const AGENT_ICONS: Record<AgentId, ComponentType<SvgIconProps>> = {
  default: AutoAwesomeIcon,
  analyst: QueryStatsIcon,
  launcher: BoltIcon,
  cleaner: CleaningServicesIcon,
};

const AGENT_DESCRIPTIONS: Record<AgentId, string> = {
  default: 'Generalista — pode fazer tudo.',
  analyst: 'Só leitura: análises, padrões, recomendações.',
  launcher: 'Foco em registrar/ajustar transações rápido.',
  cleaner: 'Foco em listar e remover transações em lote.',
};

export function AgentSelector({ selectedAgentId, onSelect, disabled }: AgentSelectorProps) {
  const { data: agents, isFetching } = useAgents();

  if (!agents || agents.length === 0) {
    return null;
  }

  return (
    <Box className="flex flex-col gap-1.5">
      <Typography variant="caption" color="text.secondary" className="px-1 uppercase tracking-wider">
        Agentes inteligentes
      </Typography>
      <Box className="flex flex-wrap gap-1.5 px-1">
        {agents.map((agent) => (
          <AgentChip
            key={agent.id}
            agent={agent}
            selected={selectedAgentId === agent.id}
            onClick={() => onSelect(selectedAgentId === agent.id ? null : agent.id)}
            disabled={disabled || isFetching}
          />
        ))}
      </Box>
    </Box>
  );
}

interface AgentChipProps {
  agent: Agent;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function AgentChip({ agent, selected, onClick, disabled }: AgentChipProps) {
  const Icon = AGENT_ICONS[agent.id] ?? AutoAwesomeIcon;
  const description = AGENT_DESCRIPTIONS[agent.id] ?? '';

  return (
    <Tooltip title={`${description} (${agent.tool_count} ferramentas)`} arrow>
      <Chip
        icon={<Icon fontSize="small" />}
        label={agent.name}
        onClick={onClick}
        disabled={disabled}
        size="small"
        sx={(theme) => ({
          bgcolor: selected ? 'primary.main' : 'transparent',
          color: selected ? 'primary.contrastText' : 'text.primary',
          border: '1px solid',
          borderColor: selected ? 'primary.main' : 'divider',
          fontWeight: selected ? 600 : 500,
          transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow']),
          boxShadow: selected
            ? `0 0 0 4px ${theme.palette.primary.main}1f`
            : 'none',
          '&:hover': {
            bgcolor: selected ? 'primary.dark' : 'action.hover',
            borderColor: selected ? 'primary.dark' : 'primary.light',
          },
          '& .MuiChip-icon': {
            color: 'inherit',
            opacity: selected ? 1 : 0.7,
          },
        })}
      />
    </Tooltip>
  );
}
