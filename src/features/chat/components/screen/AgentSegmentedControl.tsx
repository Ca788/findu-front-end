'use client';

import { type ComponentType } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeOutlined';
import QueryStatsIcon from '@mui/icons-material/QueryStatsOutlined';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import CleaningServicesIcon from '@mui/icons-material/CleaningServicesOutlined';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import { useAgents } from '@/features/chat/hooks/useAgents';
import type { Agent, AgentId } from '@/features/chat/models/agent.model';

const AGENT_ICONS: Record<AgentId, ComponentType<SvgIconProps>> = {
  default: AutoAwesomeIcon,
  analyst: QueryStatsIcon,
  launcher: BoltIcon,
  cleaner: CleaningServicesIcon,
};

interface AgentSegmentedControlProps {
  selectedAgentId: AgentId | null;
  onSelect: (agentId: AgentId | null) => void;
  disabled?: boolean;
}

export function AgentSegmentedControl({
  selectedAgentId,
  onSelect,
  disabled,
}: AgentSegmentedControlProps) {
  const { data: agents, isFetching } = useAgents();

  if (isFetching && !agents) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 36 }}>
        <CircularProgress size={14} />
      </Box>
    );
  }

  if (!agents || agents.length === 0) return null;

  return (
    <Box
      role="tablist"
      aria-label="Selecionar agente"
      sx={{
        display: 'flex',
        gap: 0.75,
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollSnapType: 'x proximity',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        py: 0.5,
      }}
    >
      {agents.map((agent) => (
        <AgentPill
          key={agent.id}
          agent={agent}
          selected={selectedAgentId === agent.id}
          onClick={() => onSelect(selectedAgentId === agent.id ? null : agent.id)}
          disabled={disabled}
        />
      ))}
    </Box>
  );
}

interface AgentPillProps {
  agent: Agent;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function AgentPill({ agent, selected, onClick, disabled }: AgentPillProps) {
  const Icon = AGENT_ICONS[agent.id] ?? AutoAwesomeIcon;

  return (
    <Box
      component="button"
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      disabled={disabled}
      sx={(theme) => ({
        flexShrink: 0,
        scrollSnapAlign: 'start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        py: 0.75,
        borderRadius: 999,
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: selected ? 600 : 500,
        bgcolor: selected ? 'primary.main' : 'background.paper',
        color: selected ? 'primary.contrastText' : 'text.primary',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        opacity: disabled ? 0.6 : 1,
        transition: theme.transitions.create(
          ['background-color', 'border-color', 'color', 'box-shadow'],
          { duration: theme.transitions.duration.shorter },
        ),
        '&:hover': disabled
          ? undefined
          : {
              borderColor: selected ? 'primary.dark' : 'primary.light',
              bgcolor: selected ? 'primary.dark' : 'action.hover',
            },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      })}
    >
      <Icon sx={{ fontSize: 16 }} />
      <span>{agent.name}</span>
    </Box>
  );
}
