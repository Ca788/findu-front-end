'use client';

import { ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  const [store] = useState(() => makeStore());
  return <Provider store={store}>{children}</Provider>;
}
