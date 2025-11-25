import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Locale = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageStore {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      // Use global variables set by blocking script to prevent hydration mismatch
      locale: (typeof window !== 'undefined' && window.__LOCALE__) || 'en',
      direction: (typeof window !== 'undefined' && window.__DIRECTION__) || 'ltr',
      setLocale: (locale: Locale) => {
        const direction: Direction = locale === 'ar' ? 'rtl' : 'ltr';
        
        // Update DOM
        document.documentElement.lang = locale;
        document.documentElement.dir = direction;
        
        // Update store
        set({ locale, direction });
        
        // Update global variables
        if (typeof window !== 'undefined') {
          window.__LOCALE__ = locale;
          window.__DIRECTION__ = direction;
        }
      },
      toggleLanguage: () => {
        const currentLocale = get().locale;
        const newLocale: Locale = currentLocale === 'en' ? 'ar' : 'en';
        const direction: Direction = newLocale === 'ar' ? 'rtl' : 'ltr';
        
        // Update DOM
        document.documentElement.lang = newLocale;
        document.documentElement.dir = direction;
        
        // Update store
        set({ locale: newLocale, direction });
        
        // Update global variables
        if (typeof window !== 'undefined') {
          window.__LOCALE__ = newLocale;
          window.__DIRECTION__ = direction;
        }
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => localStorage),
      // Merge strategy: prioritize global variables over persisted state
      merge: (persistedState, currentState) => {
        // If window.__LOCALE__ exists, use it (from blocking script)
        if (typeof window !== 'undefined' && window.__LOCALE__) {
          return { 
            ...(currentState as object), 
            ...(persistedState as object), 
            locale: window.__LOCALE__,
            direction: window.__DIRECTION__ || 'ltr'
          } as LanguageStore;
        }
        return { 
          ...(currentState as object), 
          ...(persistedState as object) 
        } as LanguageStore;
      },
    }
  )
);
