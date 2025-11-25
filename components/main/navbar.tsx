'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { GlassButton } from '@/components/ui/glass-button';
import { useLanguageStore } from '@/lib/stores/language-store';

// Dynamic import for mobile menu - only loaded when needed
const MobileMenu = dynamic(
  () => import('./mobile-menu').then(mod => ({ default: mod.MobileMenu })),
  {
    ssr: false, // Mobile menu doesn't need SSR
    loading: () => null, // No loading state needed
  }
);

interface NavbarProps {
  translations: {
    home: string;
    services: string;
    productions: string;
    aboutUs: string;
    academy: string;
    contact: string;
    cta: string;
  };
}

export function Navbar({ translations }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { direction } = useLanguageStore();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Extract locale from pathname (e.g., /en/services -> en)
  const pathParts = pathname.split('/').filter(Boolean);
  const locale = (pathParts[0] === 'en' || pathParts[0] === 'ar') ? pathParts[0] : 'en';
  
  // Check if we're on the home page, contact page, or academy page
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/ar';
  const isContactPage = pathname === '/contact' || pathname === `/${locale}/contact`;
  const isAcademyPage = pathname === '/academy' || pathname === `/${locale}/academy`;

  // Simplified scroll handler - better performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scrolling to section after navigation from another page
  useEffect(() => {
    if (!isHomePage) return;
    
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'services'].includes(hash)) {
      // Wait for the page to fully load
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const navbarHeight = 85;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          setActiveSection(hash);
        }
      }, 100);
    }
  }, [isHomePage, pathname]);

  // Active section detection using Intersection Observer
  useEffect(() => {
    // If we're on the contact page, set contact as active
    if (isContactPage) {
      setActiveSection('contact');
      return;
    }
    
    // If we're on the academy page, set academy as active
    if (isAcademyPage) {
      setActiveSection('academy');
      return;
    }
    
    // Only run section detection on home page
    if (!isHomePage) return;
    
    // Check URL hash on mount and set active section
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'services'].includes(hash)) {
      setActiveSection(hash);
    }
    
    const sections = ['home', 'services', 'about'];
    
    // Use a more aggressive approach: find which section's top is closest to the top of viewport
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for navbar height
      
      let currentSection = 'home';
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          
          // If we've scrolled past this section's start, it becomes the active one
          if (scrollPosition >= absoluteTop) {
            currentSection = sectionId;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    // Initial check
    handleScroll();
    
    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Listen to hash changes (when navigating from another page)
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && ['home', 'services', 'about'].includes(newHash)) {
        setActiveSection(newHash);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isHomePage, isContactPage, isAcademyPage]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Simplified focus management
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      const firstButton = mobileMenuRef.current.querySelector<HTMLElement>('button, a');
      firstButton?.focus();
    }
  }, [isMobileMenuOpen]);

  // Navigation links - adjust based on current page
  const navigationLinks = [
    { name: translations.home, href: isHomePage ? '#home' : '/#home', id: 'home' },
    { name: translations.services, href: `/${locale}/services`, id: 'services' },
    { name: translations.productions, href: `/${locale}/productions`, id: 'productions' },
    { name: translations.aboutUs, href: `/${locale}/about`, id: 'about' },
    { name: translations.academy, href: `/${locale}/academy`, id: 'academy' },
    { name: translations.contact, href: `/${locale}/contact`, id: 'contact' },
  ];

  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // If it's a regular page link (not a hash), navigate normally
    if (!href.startsWith('#') && !href.startsWith('/#')) {
      router.push(href);
      return;
    }

    // Extract the hash from the href
    const hash = href.startsWith('/#') ? href.substring(1) : href; // Remove leading / if present
    const targetId = hash.replace('#', '');

    // If we're not on the home page, navigate to home page with hash
    if (!isHomePage) {
      router.push(`/${locale}${hash}`);
      return;
    }

    // We're on the home page, do smooth scroll
    setTimeout(() => {
      const element = document.getElementById(targetId);

      if (element) {
        // Get navbar height (65px) plus some padding (20px) for better spacing
        const navbarHeight = 85;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 0);
  }, [isHomePage, router, locale]);

  return (
    <>
      {/* Skip to content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-6 focus:py-3 focus:rounded-full focus:backdrop-blur-lg focus:bg-white/90 dark:focus:bg-black/90 focus:text-black dark:focus:text-white focus:font-medium focus:shadow-glow focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black dark:focus:ring-offset-white"
      >
        Skip to main content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`
          relative top-0 left-0 right-0 z-50
          transition-all duration-300 ease-in-out
          ${isScrolled
            ? 'bg-transparent border-transparent pointer-events-none'
            : 'bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-lg'
          }
        `}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex items-center justify-between h-16 sm:h-16 md:h-[65px]">
            {/* Logo - Left Side - Hidden when scrolled */}
            <div className={`flex items-center transition-all duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <Link
                href={isHomePage ? '#home' : '/'}
                onClick={(e) => isHomePage ? handleSmoothScroll(e, '#home') : undefined}
                className="font-bold text-[19px] lg:text-[21px] tracking-wide hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1 transition-all duration-200 text-on-premium-glass"
                style={{ color: 'var(--glass-premium-text-primary)' }}
                aria-label="ORNINA home"
              >
                ORNINA
              </Link>
            </div>

            {/* Center Navigation Links with Premium Glassmorphism - Hidden below 600px */}
            <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2">
              <nav className="flex items-center gap-1 px-2.5 py-[7px] rounded-full glass-premium-card cinematic-glow-inner-dark">
                {navigationLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className={`relative px-[13px] py-[7px] font-medium text-[13px] lg:text-[15px] rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 ${isActive
                        ? 'bg-black/10 dark:bg-white/15 text-black dark:text-white'
                        : 'text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                        }`}
                      aria-current={isActive ? 'page' : undefined}
                      suppressHydrationWarning
                    >
                      {link.name}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right Side - Theme, Language, CTA */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Theme and Language Toggles - Always visible */}
              <div className="flex items-center gap-1.5">
                <ThemeToggle className="scale-[0.92]" />
                <LanguageToggle className="scale-[0.92]" />
              </div>

              {/* CTA Button - Hidden when scrolled */}
              <div className={`transition-all duration-300 ${isScrolled ? 'opacity-0 pointer-events-none w-0 overflow-hidden' : 'opacity-100'}`}>
                <GlassButton
                  variant="primary"
                  size="sm"
                  href="https://wa.me/1234567890"
                  className="text-[13px] px-[13px] py-[7px]"
                >
                  {translations.cta}
                </GlassButton>
              </div>
            </div>

            {/* Mobile Menu Button and Toggles - Shown below 600px (sm breakpoint) */}
            <div className="flex sm:hidden items-center gap-2 sm:gap-1.5">
              <ThemeToggle className="scale-[0.92]" />
              <LanguageToggle className="scale-[0.92]" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 sm:p-2 rounded-full glass-premium-card hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-[17px] sm:h-[17px]" style={{ color: 'var(--glass-premium-text-primary)' }} />
                ) : (
                  <Menu className="w-5 h-5 sm:w-[17px] sm:h-[17px]" style={{ color: 'var(--glass-premium-text-primary)' }} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Dynamically loaded */}
      {isMobileMenuOpen && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          direction={direction}
          navigationLinks={navigationLinks}
          ctaText={translations.cta}
          onLinkClick={handleSmoothScroll}
          menuRef={mobileMenuRef}
        />
      )}
    </>
  );
}
