import { ReactNode } from 'react';
import { MuiProvider } from '@/providers/MuiProvider';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { SnackbarProvider } from '@/providers/SnackbarProvider';
import { NativeAppEffects } from '@/providers/NativeAppEffects';
import { AuthBootstrap } from '@/features/auth/components/AuthBootstrap';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <MuiProvider>
          <SnackbarProvider>
            <NativeAppEffects />
            <AuthBootstrap />
            {children}
          </SnackbarProvider>
        </MuiProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
