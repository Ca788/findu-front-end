'use client';

import { createTheme } from '@mui/material/styles';

const PALETTE = {
  bgDefault: '#000000',
  bgPaper:   '#0A0A0A',
  bgRaised:  '#121212',
  border:    'rgba(255, 255, 255, 0.06)',
  borderHi:  'rgba(255, 255, 255, 0.10)',
  textHi:    '#F5F5F5',
  textMid:   '#A3A3A3',
  textLow:   '#525252',
};

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#A3E635',
      dark: '#84CC16',
      light: '#BEF264',
      contrastText: '#0A0A0A',
    },
    secondary: {
      main: '#A3A3A3',
      dark: '#737373',
      light: '#D4D4D4',
    },
    background: {
      default: PALETTE.bgDefault,
      paper:   PALETTE.bgPaper,
    },
    text: {
      primary:  PALETTE.textHi,
      secondary: PALETTE.textMid,
      disabled:  PALETTE.textLow,
    },
    divider: PALETTE.border,
    error:   { main: '#F87171' },
    warning: { main: '#FBBF24' },
    info:    { main: '#60A5FA' },
    success: { main: '#A3E635' },
    action: {
      hover:    'rgba(255, 255, 255, 0.04)',
      selected: 'rgba(255, 255, 255, 0.06)',
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
          backgroundColor: PALETTE.bgDefault,
          color: PALETTE.textHi,
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
          backgroundColor: PALETTE.bgPaper,
          border: `1px solid ${PALETTE.border}`,
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: {
          backgroundColor: PALETTE.bgDefault,
          borderBottom: `1px solid ${PALETTE.border}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: PALETTE.bgDefault,
          backgroundImage: 'none',
          borderColor: PALETTE.border,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: PALETTE.bgPaper,
          border: `1px solid ${PALETTE.border}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: PALETTE.bgPaper,
          backgroundImage: 'none',
          border: `1px solid ${PALETTE.border}`,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: PALETTE.bgRaised,
          backgroundImage: 'none',
          border: `1px solid ${PALETTE.border}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: PALETTE.bgRaised,
          backgroundImage: 'none',
          border: `1px solid ${PALETTE.border}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: PALETTE.bgRaised,
          border: `1px solid ${PALETTE.border}`,
          color: PALETTE.textHi,
          fontSize: 12,
        },
        arrow: { color: PALETTE.bgRaised },
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
            borderColor: PALETTE.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: PALETTE.borderHi,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: PALETTE.border },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          border: `1px solid ${PALETTE.border}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: PALETTE.border },
      },
    },
  },
});

export default theme;
