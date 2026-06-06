'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';

interface SnackbarOptions {
  message: string;
  severity?: AlertColor;
  duration?: number;
}

interface SnackbarContextValue {
  show: (options: SnackbarOptions) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

const DEFAULT_DURATION = 5000;

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Required<SnackbarOptions>>({
    message: '',
    severity: 'info',
    duration: DEFAULT_DURATION,
  });

  const show = useCallback((opts: SnackbarOptions) => {
    setOptions({
      severity: 'info',
      duration: DEFAULT_DURATION,
      ...opts,
    });
    setOpen(true);
  }, []);

  const value = useMemo<SnackbarContextValue>(
    () => ({
      show,
      showError: (message) => show({ message, severity: 'error' }),
      showSuccess: (message) => show({ message, severity: 'success' }),
      showInfo: (message) => show({ message, severity: 'info' }),
    }),
    [show],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={options.duration}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={options.severity}
          variant="filled"
          className="w-full"
        >
          {options.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return ctx;
}
