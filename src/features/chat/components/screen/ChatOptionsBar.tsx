'use client';

import { useState, type MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/CheckRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import { useAgents } from '@/features/chat/hooks/useAgents';
import { useModels } from '@/features/chat/hooks/useModels';
import type { AgentId } from '@/features/chat/models/agent.model';

interface ChatOptionsBarProps {
  selectedModelId: string | null;
  selectedAgentId: AgentId | null;
  onSelectModel: (modelId: string | null) => void;
  onSelectAgent: (agentId: AgentId | null) => void;
  disabled?: boolean;
}

export function ChatOptionsBar({
  selectedModelId,
  selectedAgentId,
  onSelectModel,
  onSelectAgent,
  disabled,
}: ChatOptionsBarProps) {
  const { data: models, isFetching: loadingModels } = useModels();
  const { data: agents, isFetching: loadingAgents } = useAgents();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const currentModel =
    models?.find((model) => model.id === selectedModelId) ?? models?.[0];
  const currentAgent =
    agents?.find((agent) => agent.id === selectedAgentId) ?? null;

  const label = currentModel?.name ?? 'Modelo';
  const sub = currentAgent?.name;

  const open = Boolean(anchor);
  const loading = (loadingModels && !models) || (loadingAgents && !agents);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 36 }}>
        <CircularProgress size={14} />
      </Box>
    );
  }

  if (!models?.length && !agents?.length) return null;

  return (
    <>
      <Button
        onClick={(event: MouseEvent<HTMLButtonElement>) =>
          setAnchor(event.currentTarget)
        }
        disabled={disabled}
        endIcon={<ExpandMoreIcon />}
        sx={{
          textTransform: 'none',
          color: 'text.primary',
          fontWeight: 600,
          fontSize: 15,
          px: 1,
          borderRadius: 999,
          minWidth: 0,
        }}
      >
        <Box sx={{ textAlign: 'left', lineHeight: 1.15 }}>
          <Box component="span" sx={{ display: 'block' }}>
            {label}
          </Box>
          {sub ? (
            <Box
              component="span"
              sx={{
                display: 'block',
                fontSize: 11,
                fontWeight: 500,
                color: 'text.secondary',
              }}
            >
              {sub}
            </Box>
          ) : null}
        </Box>
      </Button>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        slotProps={{
          paper: {
            sx: { minWidth: 260, maxWidth: 320, borderRadius: 2.5 },
          },
        }}
      >
        {models && models.length > 0 && (
          <Box>
            <Box
              sx={{
                px: 2,
                pt: 1.25,
                pb: 0.5,
                fontSize: 11,
                fontWeight: 700,
                color: 'text.secondary',
                letterSpacing: 0.04,
              }}
            >
              Modelo
            </Box>
            {models.map((model) => {
              const selected = (selectedModelId ?? models[0]?.id) === model.id;
              return (
                <MenuItem
                  key={model.id}
                  selected={selected}
                  onClick={() => {
                    onSelectModel(model.id);
                    setAnchor(null);
                  }}
                >
                  {selected ? (
                    <ListItemIcon>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                  ) : (
                    <ListItemIcon />
                  )}
                  <ListItemText primary={model.name} />
                </MenuItem>
              );
            })}
          </Box>
        )}

        {agents && agents.length > 0 && (
          <Box>
            <Divider sx={{ my: 0.5 }} />
            <Box
              sx={{
                px: 2,
                pt: 1,
                pb: 0.5,
                fontSize: 11,
                fontWeight: 700,
                color: 'text.secondary',
                letterSpacing: 0.04,
              }}
            >
              Agente
            </Box>
            {agents.map((agent) => {
              const selected = selectedAgentId === agent.id;
              return (
                <MenuItem
                  key={agent.id}
                  selected={selected}
                  onClick={() => {
                    onSelectAgent(selected ? null : agent.id);
                    setAnchor(null);
                  }}
                >
                  {selected ? (
                    <ListItemIcon>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                  ) : (
                    <ListItemIcon />
                  )}
                  <ListItemText primary={agent.name} />
                </MenuItem>
              );
            })}
          </Box>
        )}
      </Menu>
    </>
  );
}
