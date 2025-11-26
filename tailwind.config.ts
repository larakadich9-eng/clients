import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  // Optimize for production
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      'xs': '320px',
      'sm': '600px',
      'md': '1024px',
      'lg': '1280px',
      'xl': '1920px',
      '2xl': '2560px',
    },
    extend: {
      spacing: {
        '12': '12px',
        '24': '24px',
        '48': '48px',
        /* Fluid spacing that scales with viewport */
        'fluid-xs': 'clamp(8px, 1vw, 12px)',
        'fluid-sm': 'clamp(12px, 1.5vw, 16px)',
        'fluid-md': 'clamp(16px, 2vw, 24px)',
        'fluid-lg': 'clamp(24px, 3vw, 32px)',
        'fluid-xl': 'clamp(32px, 4vw, 48px)',
        'fluid-2xl': 'clamp(48px, 5vw, 64px)',
      },
      gap: {
        /* Fluid gap spacing for grids and flexbox */
        'fluid-xs': 'clamp(8px, 1vw, 12px)',
        'fluid-sm': 'clamp(12px, 1.5vw, 16px)',
        'fluid-md': 'clamp(16px, 2vw, 24px)',
        'fluid-lg': 'clamp(24px, 3vw, 32px)',
        'fluid-xl': 'clamp(32px, 4vw, 48px)',
      },
      scale: {
        '102': '1.02',
      },
      fontFamily: {
        'arabic': ['var(--font-ibm-plex-arabic)', 'var(--font-cairo)', 'sans-serif'],
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'inter': ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* 2025 Modern Typography Scale with Fluid Sizing */
        'xs': ['clamp(11px, 1.2vw, 14px)', { lineHeight: '1.5', letterSpacing: '-0.2px', fontWeight: '400' }],
        'sm': ['clamp(12px, 1.5vw, 16px)', { lineHeight: '1.5', letterSpacing: '-0.2px', fontWeight: '400' }],
        'base': ['clamp(14px, 2vw, 18px)', { lineHeight: '1.6', letterSpacing: '-0.3px', fontWeight: '400' }],
        'lg': ['clamp(16px, 2.2vw, 20px)', { lineHeight: '1.6', letterSpacing: '-0.3px', fontWeight: '500' }],
        'xl': ['clamp(18px, 2.5vw, 22px)', { lineHeight: '1.7', letterSpacing: '-0.4px', fontWeight: '500' }],
        '2xl': ['clamp(20px, 3vw, 26px)', { lineHeight: '1.7', letterSpacing: '-0.4px', fontWeight: '600' }],
        '3xl': ['clamp(24px, 3.5vw, 32px)', { lineHeight: '1.8', letterSpacing: '-0.5px', fontWeight: '600' }],
        '4xl': ['clamp(28px, 4vw, 40px)', { lineHeight: '1.8', letterSpacing: '-0.6px', fontWeight: '700' }],
        '5xl': ['clamp(36px, 5vw, 52px)', { lineHeight: '1.9', letterSpacing: '-0.8px', fontWeight: '700' }],
        '6xl': ['clamp(48px, 6vw, 64px)', { lineHeight: '1.9', letterSpacing: '-1px', fontWeight: '800' }],
      },
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
        },
        'glass-premium': {
          'layer-light': 'rgba(255, 255, 255, 0.35)',
          'layer-dark': 'rgba(20, 20, 20, 0.4)',
          'card-light': 'rgba(255, 255, 255, 0.45)',
          'card-dark': 'rgba(20, 20, 20, 0.5)',
          'input-light': 'rgba(255, 255, 255, 0.5)',
          'input-dark': 'rgba(20, 20, 20, 0.5)',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '24px',
        xl: '40px',
        glass: '12px',
        'glass-input': '8px',
        'premium-layer-light': '40px',
        'premium-layer-dark': '30px',
        'premium-card': '25px',
        'premium-input': '18px',
      },
      backgroundColor: {
        'glass-fallback': 'rgba(255, 255, 255, 0.3)',
        'glass-fallback-dark': 'rgba(0, 0, 0, 0.3)',
        'glass-dark-card': 'rgba(0, 0, 0, 0.3)',
        'glass-dark-input': 'rgba(0, 0, 0, 0.2)',
        'glass-dark-bg': 'rgba(0, 0, 0, 0.4)',
        'glass-light-card': 'rgba(255, 255, 255, 0.3)',
        'glass-light-input': 'rgba(255, 255, 255, 0.2)',
        'glass-light-bg': 'rgba(255, 255, 255, 0.4)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 255, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 255, 255, 0.4)',
        'cinematic-light': '0 4px 40px rgba(0, 0, 0, 0.05)',
        'cinematic-dark': '0 4px 40px rgba(255, 255, 255, 0.05)',
        'glow-inner-light': 'inset 0 1px 3px rgba(255, 255, 255, 0.8)',
        'glow-inner-dark': 'inset 0 1px 3px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'services-scroll-ltr': 'services-scroll-ltr 40s linear infinite',
        'services-scroll-rtl': 'services-scroll-rtl 40s linear infinite',
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        'services-scroll-ltr': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'services-scroll-rtl': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(50%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      container: {
        center: true,
        padding: {
          'xs': 'clamp(16px, 4vw, 24px)',
          'sm': 'clamp(16px, 4vw, 24px)',
          'md': 'clamp(24px, 3vw, 32px)',
          'lg': 'clamp(32px, 2vw, 48px)',
          'xl': 'clamp(48px, 2vw, 64px)',
          '2xl': 'clamp(64px, 2vw, 80px)',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
};

export default config;
