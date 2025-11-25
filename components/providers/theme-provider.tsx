'use client';

import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/lib/stores/theme-store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the first render - blocking script already applied the theme
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only apply theme changes after initial mount (when user toggles)
    try {
      const html = document.documentElement;
      html.classList.remove('light', 'dark');
      html.classList.add(theme);
      html.setAttribute('data-theme', theme);
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  }, [theme]);

  return <>{children}</>;
}
