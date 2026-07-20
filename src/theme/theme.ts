'use client';

import { createTheme, Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

const DARK_PALETTE = {
  bgDefault: '#131314',
  bgPaper:   '#1B1C1D',
  bgRaised:  '#1F2022',
  border:    'rgba(255, 255, 255, 0.08)',
  borderHi:  'rgba(255, 255, 255, 0.14)',
  textHi:    '#E3E3E3',
  textMid:   '#9AA0A6',
  textLow:   '#5F6368',
  actionHover:    'rgba(255, 255, 255, 0.06)',
  actionSelected: 'rgba(138, 180, 248, 0.16)',
  primaryMain:    '#8AB4F8',
  primaryDark:    '#669DF6',
  primaryLight:   '#A8C7FA',
  primaryContrast:'#0B1424',
};

const LIGHT_PALETTE = {
  bgDefault: '#FFFFFF',
  bgPaper:   '#F8F9FA',
  bgRaised:  '#F1F3F4',
  border:    'rgba(60, 64, 67, 0.10)',
  borderHi:  'rgba(60, 64, 67, 0.18)',
  textHi:    '#1F1F1F',
  textMid:   '#5F6368',
  textLow:   '#9AA0A6',
  actionHover:    'rgba(60, 64, 67, 0.06)',
  actionSelected: 'rgba(26, 115, 232, 0.10)',
  primaryMain:    '#1A73E8',
  primaryDark:    '#1557B0',
  primaryLight:   '#4285F4',
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
      error:   { main: mode === 'dark' ? '#F28B82' : '#D93025' },
      warning: { main: mode === 'dark' ? '#FDD663' : '#F29900' },
      info:    { main: mode === 'dark' ? '#8AB4F8' : '#1A73E8' },
      success: { main: mode === 'dark' ? '#81C995' : '#1E8E3E' },
      action: {
        hover:    p.actionHover,
        selected: p.actionSelected,
      },
    },
    shape: {
      borderRadius: 16,
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
          root: { borderRadius: 999, paddingInline: 18 },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: p.bgPaper,
            border: `1px solid ${p.border}`,
            borderRadius: 16,
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
            borderRadius: 12,
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
            borderRadius: 999,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottomColor: p.border },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            '&.Mui-selected': {
              backgroundColor: p.actionSelected,
              '&:hover': { backgroundColor: p.actionSelected },
            },
          },
        },
      },
    },
  });
}

export default getTheme('dark');
