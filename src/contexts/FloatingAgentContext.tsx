'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppStorageKeys } from '@/constants/AppStorageKeys';
import { appStorage } from '@/infrastructure/storage/StorageBuilder';
import type { AgentId } from '@/features/chat/models/agent.model';

interface FloatingAgentContextValue {
  open: boolean;
  conversationId: string | null;
  selectedAgentId: AgentId | null;
  toggle: () => void;
  setOpen: (next: boolean) => void;
  setConversationId: (id: string | null) => void;
  setSelectedAgentId: (id: AgentId | null) => void;
}

const FloatingAgentContext = createContext<FloatingAgentContextValue | null>(null);

function readBoolean(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const stored = appStorage.get<boolean>(key);
  return typeof stored === 'boolean' ? stored : fallback;
}

function readString<T extends string>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const stored = appStorage.get<T>(key);
  return typeof stored === 'string' ? stored : null;
}

export function FloatingAgentProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(() => readBoolean(AppStorageKeys.FLOATING_AGENT_OPEN, false));
  const [conversationId, setConversationIdState] = useState<string | null>(
    () => readString<string>(AppStorageKeys.FLOATING_AGENT_CONVERSATION_ID),
  );
  const [selectedAgentId, setSelectedAgentIdState] = useState<AgentId | null>(
    () => readString<AgentId>(AppStorageKeys.FLOATING_AGENT_SELECTED),
  );

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next);
    appStorage.set(AppStorageKeys.FLOATING_AGENT_OPEN, next);
  }, []);

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  const setConversationId = useCallback((id: string | null) => {
    setConversationIdState(id);
    if (id) appStorage.set(AppStorageKeys.FLOATING_AGENT_CONVERSATION_ID, id);
    else appStorage.remove(AppStorageKeys.FLOATING_AGENT_CONVERSATION_ID);
  }, []);

  const setSelectedAgentId = useCallback((id: AgentId | null) => {
    setSelectedAgentIdState(id);
    if (id) appStorage.set(AppStorageKeys.FLOATING_AGENT_SELECTED, id);
    else appStorage.remove(AppStorageKeys.FLOATING_AGENT_SELECTED);
  }, []);

  const value = useMemo<FloatingAgentContextValue>(
    () => ({
      open,
      conversationId,
      selectedAgentId,
      toggle,
      setOpen,
      setConversationId,
      setSelectedAgentId,
    }),
    [open, conversationId, selectedAgentId, toggle, setOpen, setConversationId, setSelectedAgentId],
  );

  return <FloatingAgentContext.Provider value={value}>{children}</FloatingAgentContext.Provider>;
}

export function useFloatingAgent(): FloatingAgentContextValue {
  const context = useContext(FloatingAgentContext);
  if (!context) {
    throw new Error('useFloatingAgent must be used within a FloatingAgentProvider');
  }
  return context;
}
