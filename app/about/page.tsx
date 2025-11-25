'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/main/navbar';
import { ContainerScroll, CardSticky } from '@/components/ui/cards-stack';
import { useTranslations, useLocale } from 'next-intl';

const Process = ({ t }: { t: any }) => {
  const locale = useLocale();
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-card]');
      let max = 0;
      cards.forEach((card) => {
        const height = (card as HTMLElement).offsetHeight;
        if (height > max) max = height;
      });
      setMaxHeight(max);
    }
  }, []);



  const PROCESS_PHASES = [
    {
      id: 'process-1',
      title: t('aboutUs.general.title'),
      description: t('aboutUs.general.content'),
    },
    {
      id: 'process-2',
      title: t('aboutUs.official.title'),
      description: t('aboutUs.official.content'),
    },
    {
      id: 'process-3',
      title: t('aboutUs.creative.title'),
      description: t('aboutUs.creative.content'),
    },
    {
      id: 'process-4',
      title: t('aboutUs.executive.title'),
      description: t('aboutUs.executive.content'),
    },
    {
      id: 'process-5',
      title: t('aboutUs.comprehensive.title'),
      description: t('aboutUs.comprehensive.content'),
    },
    {
      id: 'process-6',
      title: t('aboutUs.partnerships.title'),
      description: t('aboutUs.partnerships.content'),
    },
  ];

  return (
    <div className="min-h-svh bg-stone-50 dark:bg-black px-6 text-stone-900 dark:text-stone-50 xl:px-12 py-12" style={{ paddingTop: '0px' }}>
      <div className="grid grid-cols-2 gap-12">
        {/* Left Column - Text */}
        <div className="sticky top-[65px] grid grid-cols-4 gap-0" style={{ height: 'calc(100vh - 65px)', paddingTop: 'calc(33.33vh - 120px)' }}>
          <div></div>
          <div className="col-span-3 flex flex-col items-start pr-4">
            <div style={{ width: 'calc(66.66% * 33.33%)' }}>
              <h2 className="text-4xl font-bold mb-6 text-black dark:text-white" style={{ fontFamily: 'Dubai' }}>
                {t('hero.title')} <span className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 dark:from-gray-400 dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent backdrop-blur-sm" style={{ WebkitBackdropFilter: 'blur(10px)' }}>Ornina</span>
              </h2>
              <p className="text-lg leading-relaxed text-black/75 dark:text-white/75" style={{ fontFamily: 'Dubai', whiteSpace: 'pre-wrap' }}>
                {t('hero.aboutDescription')}
              </p>
            </div>

          </div>
        </div>

        {/* Right Column - Divided into 3 equal sections */}
        <div className="flex flex-col justify-start items-center w-full">
          {/* First Third */}
          <div className="w-2/3 h-[33.33vh]"></div>
          
          {/* Second and Third Thirds - Cards container */}
          <div className="w-2/3 flex justify-center items-start">
            <ContainerScroll key={locale} ref={containerRef} className="min-h-[300vh] space-y-6 w-full" style={{ marginTop: 'calc(-33.33vh + 50px)', paddingTop: '65px' }}>
              {PROCESS_PHASES.map((phase, index) => (
                <CardSticky
                  key={phase.id}
                  index={index}
                  incrementZ={10}
                  className="rounded-lg border border-stone-200 dark:border-stone-700 p-10 backdrop-blur-md dark:bg-stone-900/50 flex flex-col justify-start gap-4"
                  style={{
                    top: 'calc(33.33vh - 65px)',
                    height: maxHeight > 0 ? `${maxHeight}px` : 'auto',
                    minHeight: 'auto',
                    boxShadow: locale === 'ar' 
                      ? `-${6 + index * 6}px ${12 + index * 12}px ${24 + index * 24}px rgba(0, 0, 0, ${0.4 + index * 0.25})`
                      : `${6 + index * 6}px ${12 + index * 12}px ${24 + index * 24}px rgba(0, 0, 0, ${0.4 + index * 0.25})`,
                    transform: locale === 'ar'
                      ? `translateY(${index * 12}px) translateX(${index * 8}px)`
                      : `translateY(${index * 12}px) translateX(${index * -8}px)`,
                  }}
                  data-card
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h2 className={`text-xl font-bold tracking-tight flex-1 text-black dark:text-white ${locale === 'ar' ? '' : 'font-sans'}`} style={{ fontFamily: locale === 'ar' ? 'Dubai' : 'system-ui, -apple-system, sans-serif' }}>{phase.title}</h2>
                    <div className="flex-shrink-0 px-3 py-1 rounded-lg backdrop-blur-md bg-gradient-to-br from-gray-200/30 via-black/5 to-gray-300/30 dark:from-white/15 dark:via-gray-300/15 dark:to-white/15 border border-gray-400/30 dark:border-white/30">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-black dark:from-gray-200 dark:to-white bg-clip-text text-transparent">{String(index + 1).padStart(2, '0')}</h3>
                    </div>
                  </div>
                  <p className={`text-stone-800 dark:text-stone-300 text-base leading-relaxed font-medium ${locale === 'ar' ? '' : 'font-sans'}`} style={{ fontFamily: locale === 'ar' ? 'Dubai' : 'system-ui, -apple-system, sans-serif' }}>{phase.description}</p>
                </CardSticky>
              ))}
              {/* Spacer for last card visibility */}
              <div style={{ height: '50vh' }}></div>
            </ContainerScroll>
          </div>
        </div>
      </div>
    </div>
  );
};



export default function AboutUsPage() {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navTranslations = {
    home: mounted ? t('nav.home') : 'Home',
    services: mounted ? t('nav.services') : 'Services',
    productions: mounted ? t('nav.productions') : 'Productions',
    aboutUs: mounted ? t('nav.aboutUs') : 'About Us',
    academy: mounted ? t('nav.academy') : 'Academy',
    contact: mounted ? t('nav.contact') : 'Contact',
    cta: mounted ? t('nav.cta') : "Let's Create",
  };

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-stone-50 dark:bg-black">
        <Navbar translations={navTranslations} />
      </div>
    );
  }

  return (
    <div className="w-full" style={{ scrollbarWidth: 'auto', scrollbarColor: 'rgba(0,0,0,0.3) transparent' }}>
      <style>{`
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.6);
          border-radius: 6px;
          backdrop-filter: blur(10px);
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(80, 80, 80, 0.8);
        }
        .dark ::-webkit-scrollbar-thumb {
          background: rgba(120, 120, 120, 0.7);
          backdrop-filter: blur(10px);
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: rgba(150, 150, 150, 0.9);
        }
      `}</style>
      <Navbar translations={navTranslations} />
      <Process t={t} />
    </div>
  );
}
