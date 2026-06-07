'use client';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface UseDeviceResult {
  device: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useDevice(): UseDeviceResult {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const device: DeviceType = isMobile
    ? 'mobile'
    : isTablet
      ? 'tablet'
      : 'desktop';

  return { device, isMobile, isTablet, isDesktop };
}
