import { configureStore } from '@reduxjs/toolkit';

const readyReducer = (state: { ready: true } = { ready: true }) => state;

export const makeStore = () =>
  configureStore({
    reducer: {
      _ready: readyReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
