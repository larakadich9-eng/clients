'use client';

import { useEffect, useRef } from 'react';
import { useLanguageStore } from '@/lib/stores/language-store';
import { NextIntlClientProvider } from 'next-intl';

// Import translations statically to avoid fetch issues
import enMessages from '@/public/locales/en.json';
import arMessages from '@/public/locales/ar.json';

interface LanguageProviderProps {
  children: React.ReactNode;
}

const messagesMap: Record<string, any> = {
  en: enMessages,
  ar: arMessages,
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const locale = useLanguageStore((state) => state.locale);
  const direction = useLanguageStore((state) => state.direction);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the first render - blocking script already applied the language
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only apply language changes after initial mount (when user toggles)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = direction;
    }
  }, [locale, direction]);

  const messages = messagesMap[locale] || enMessages;

  return (
    <div suppressHydrationWarning>
      <NextIntlClientProvider 
        locale={locale} 
        messages={messages as any}
        timeZone="UTC"
      >
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
