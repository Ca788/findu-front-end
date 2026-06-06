import { ReactNode } from 'react';
import { MuiProvider } from '@/providers/MuiProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <MuiProvider>{children}</MuiProvider>;
}
