import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Tajawal, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { WebVitalsReporter } from "@/components/providers/web-vitals";

// Optimize font loading with font-display: swap to prevent FOIT
// Preload critical font weights for better performance
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap', // Prevents Flash of Invisible Text (FOIT)
  preload: true, // Preload font for faster initial render
  variable: '--font-ibm-plex-arabic',
  adjustFontFallback: true, // Reduce layout shift
  // Next.js automatically adds preconnect for Google Fonts
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800', '900'],
  display: 'swap', // Prevents Flash of Invisible Text (FOIT)
  preload: true, // Preload font for faster initial render
  variable: '--font-cairo',
  adjustFontFallback: true, // Reduce layout shift
  // Next.js automatically adds preconnect for Google Fonts
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap', // Prevents Flash of Invisible Text (FOIT)
  preload: true, // Preload font for faster initial render
  variable: '--font-inter',
  adjustFontFallback: true, // Reduce layout shift
  // Next.js automatically adds preconnect for Google Fonts
});

export const metadata: Metadata = {
  title: "ORNINA - Where Intelligence Meets Creativity",
  description: "AI creative studio delivering premium digital experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* CRITICAL: Hydration Fix - This script MUST run before React hydration to prevent mismatch */}
        {/* Reads user preferences from localStorage and applies them to DOM before React loads */}
        {/* This ensures SSR HTML matches client-side expectations, eliminating hydration errors */}
        <script
          id="hydration-fix-script"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Read theme from localStorage
                  const themeStorage = localStorage.getItem('ornina-theme-storage');
                  const theme = themeStorage 
                    ? JSON.parse(themeStorage).state.theme 
                    : 'dark';
                  
                  // Apply theme to DOM (data-theme attribute + class for Tailwind)
                  const html = document.documentElement;
                  html.setAttribute('data-theme', theme);
                  html.classList.remove('light', 'dark');
                  html.classList.add(theme);
                  
                  // Store in global variable for Zustand initialization
                  window.__THEME__ = theme;
                  
                  // Read language from localStorage
                  const langStorage = localStorage.getItem('language-storage');
                  const locale = langStorage 
                    ? JSON.parse(langStorage).state.locale 
                    : 'en';
                  const direction = locale === 'ar' ? 'rtl' : 'ltr';
                  
                  // Apply language to DOM (lang + dir attributes)
                  html.lang = locale;
                  html.dir = direction;
                  
                  // Store in global variables for Zustand initialization
                  window.__LOCALE__ = locale;
                  window.__DIRECTION__ = direction;
                } catch (e) {
                  // Fallback to defaults on any error
                  const html = document.documentElement;
                  html.setAttribute('data-theme', 'dark');
                  html.classList.add('dark');
                  html.lang = 'en';
                  html.dir = 'ltr';
                  window.__THEME__ = 'dark';
                  window.__LOCALE__ = 'en';
                  window.__DIRECTION__ = 'ltr';
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${ibmPlexArabic.variable} ${tajawal.variable} ${inter.variable} font-arabic antialiased`} suppressHydrationWarning>
        <WebVitalsReporter />
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
