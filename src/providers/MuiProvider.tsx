'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme, ThemeMode } from '@/theme/theme';

const STORAGE_KEY = 'findu:theme-mode';
const DEFAULT_MODE: ThemeMode = 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getClientSnapshot(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : DEFAULT_MODE;
}

function getServerSnapshot(): ThemeMode {
  return DEFAULT_MODE;
}

function persistMode(next: ThemeMode): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, next);
  // O evento `storage` só dispara em outras abas. Despachamos manualmente
  // para que useSyncExternalStore detecte a mudança nesta mesma aba.
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: next }));
}

interface MuiProviderProps {
  children: ReactNode;
}

export function MuiProvider({ children }: MuiProviderProps) {
  const mode = useSyncExternalStore(
    subscribeToStorage,
    getClientSnapshot,
    getServerSnapshot,
  );

  const setMode = useCallback((next: ThemeMode) => {
    persistMode(next);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const contextValue = useMemo<ThemeModeContextValue>(
    () => ({ mode, toggleMode, setMode }),
    [mode, toggleMode, setMode],
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within MuiProvider');
  }
  return ctx;
}
