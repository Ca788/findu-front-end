'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',
      dark: '#2563EB',
      light: '#60A5FA',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#94A3B8',
      dark: '#64748B',
      light: '#CBD5E1',
    },
    background: {
      default: '#0A0F1C',
      paper: '#111827',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      disabled: '#475569',
    },
    divider: 'rgba(148, 163, 184, 0.12)',
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    info: { main: '#38BDF8' },
    success: { main: '#22C55E' },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      'var(--font-geist-sans)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontWeight: 600, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(148, 163, 184, 0.08)',
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: {
          backgroundColor: '#0A0F1C',
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
