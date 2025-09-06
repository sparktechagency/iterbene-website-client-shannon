"use client";
import { useState, useEffect } from 'react';

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof BreakpointConfig | 'xs';

interface ResponsiveHookReturn {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeScreen: boolean;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
}

export const useResponsive = (breakpoints: Partial<BreakpointConfig> = {}): ResponsiveHookReturn => {
  const config = { ...defaultBreakpoints, ...breakpoints };
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = windowSize;

  // Determine current breakpoint
  const getBreakpoint = (width: number): Breakpoint => {
    if (width >= config['2xl']) return '2xl';
    if (width >= config.xl) return 'xl';
    if (width >= config.lg) return 'lg';
    if (width >= config.md) return 'md';
    if (width >= config.sm) return 'sm';
    return 'xs';
  };

  const breakpoint = getBreakpoint(width);

  return {
    width,
    height,
    breakpoint,
    
    // Convenience flags
    isMobile: width < config.md,
    isTablet: width >= config.md && width < config.lg,
    isDesktop: width >= config.lg,
    isLargeScreen: width >= config.xl,
    
    // Breakpoint flags
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2xl: breakpoint === '2xl',
  };
};

// Hook for checking if screen is at least a certain breakpoint
export const useBreakpoint = (minBreakpoint: Breakpoint): boolean => {
  const { breakpoint } = useResponsive();
  
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  const minIndex = breakpointOrder.indexOf(minBreakpoint);
  
  return currentIndex >= minIndex;
};

// Hook for responsive values
export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>): T | undefined => {
  const { breakpoint } = useResponsive();
  
  // Return value for current breakpoint or closest smaller one
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
};