'use client';

import { createTheme, Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

const DARK_PALETTE = {
  bgDefault: '#000000',
  bgPaper:   '#0A0A0A',
  bgRaised:  '#121212',
  border:    'rgba(255, 255, 255, 0.06)',
  borderHi:  'rgba(255, 255, 255, 0.10)',
  textHi:    '#F5F5F5',
  textMid:   '#A3A3A3',
  textLow:   '#525252',
  actionHover:    'rgba(255, 255, 255, 0.04)',
  actionSelected: 'rgba(255, 255, 255, 0.06)',
  primaryMain:    '#A3E635',
  primaryDark:    '#84CC16',
  primaryLight:   '#BEF264',
  primaryContrast:'#0A0A0A',
};

const LIGHT_PALETTE = {
  bgDefault: '#FFFFFF',
  bgPaper:   '#FAFAFA',
  bgRaised:  '#F5F5F5',
  border:    'rgba(0, 0, 0, 0.08)',
  borderHi:  'rgba(0, 0, 0, 0.14)',
  textHi:    '#0A0A0A',
  textMid:   '#525252',
  textLow:   '#A3A3A3',
  actionHover:    'rgba(0, 0, 0, 0.04)',
  actionSelected: 'rgba(0, 0, 0, 0.06)',
  primaryMain:    '#65A30D',
  primaryDark:    '#4D7C0F',
  primaryLight:   '#84CC16',
  primaryContrast:'#FFFFFF',
};

export function getTheme(mode: ThemeMode): Theme {
  const p = mode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: p.primaryMain,
        dark: p.primaryDark,
        light: p.primaryLight,
        contrastText: p.primaryContrast,
      },
      secondary: {
        main: p.textMid,
        dark: p.textLow,
        light: p.borderHi,
      },
      background: {
        default: p.bgDefault,
        paper:   p.bgPaper,
      },
      text: {
        primary:   p.textHi,
        secondary: p.textMid,
        disabled:  p.textLow,
      },
      divider: p.border,
      error:   { main: mode === 'dark' ? '#F87171' : '#DC2626' },
      warning: { main: mode === 'dark' ? '#FBBF24' : '#D97706' },
      info:    { main: mode === 'dark' ? '#60A5FA' : '#2563EB' },
      success: { main: p.primaryMain },
      action: {
        hover:    p.actionHover,
        selected: p.actionSelected,
      },
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
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: p.bgDefault,
            color: p.textHi,
          },
        },
      },
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
            backgroundColor: p.bgPaper,
            border: `1px solid ${p.border}`,
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'transparent' },
        styleOverrides: {
          root: {
            backgroundColor: p.bgDefault,
            borderBottom: `1px solid ${p.border}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: p.bgDefault,
            backgroundImage: 'none',
            borderColor: p.border,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: p.bgPaper,
            border: `1px solid ${p.border}`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: p.bgPaper,
            backgroundImage: 'none',
            border: `1px solid ${p.border}`,
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: p.bgRaised,
            backgroundImage: 'none',
            border: `1px solid ${p.border}`,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: p.bgRaised,
            backgroundImage: 'none',
            border: `1px solid ${p.border}`,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: p.bgRaised,
            border: `1px solid ${p.border}`,
            color: p.textHi,
            fontSize: 12,
          },
          arrow: { color: p.bgRaised },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: 'transparent',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: p.border,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: p.borderHi,
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: p.border },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            border: `1px solid ${p.border}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottomColor: p.border },
        },
      },
    },
  });
}

export default getTheme('dark');
