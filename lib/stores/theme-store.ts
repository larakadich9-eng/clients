import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Use global variable from blocking script as initial value
      theme: (typeof window !== 'undefined' && window.__THEME__) || 'dark',
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        
        // Update DOM
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(newTheme);
        html.setAttribute('data-theme', newTheme);
        
        // Update store (this will save to localStorage via persist middleware)
        set({ theme: newTheme });
        
        // Update global variable
        if (typeof window !== 'undefined') {
          window.__THEME__ = newTheme;
        }
      },
      
      setTheme: (theme) => {
        // Update DOM
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(theme);
        html.setAttribute('data-theme', theme);
        
        // Update store (this will save to localStorage via persist middleware)
        set({ theme });
        
        // Update global variable
        if (typeof window !== 'undefined') {
          window.__THEME__ = theme;
        }
      },
    }),
    {
      name: 'ornina-theme-storage',
      storage: createJSONStorage(() => localStorage),
      // Merge strategy: prioritize window.__THEME__ over persisted state
      merge: (persistedState, currentState) => {
        // If window.__THEME__ exists (from blocking script), use it
        if (typeof window !== 'undefined' && window.__THEME__) {
          return {
            ...(currentState as object),
            ...(persistedState as object),
            theme: window.__THEME__,
          } as ThemeStore;
        }
        return {
          ...(currentState as object),
          ...(persistedState as object),
        } as ThemeStore;
      },
    }
  )
);
