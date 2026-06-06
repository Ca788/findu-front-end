import { ReactNode } from 'react';
import { MuiProvider } from '@/providers/MuiProvider';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { QueryProvider } from '@/providers/QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <MuiProvider>{children}</MuiProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
