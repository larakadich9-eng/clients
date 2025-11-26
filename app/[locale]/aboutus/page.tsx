'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/main/navbar'
import { TuringLanding } from '@/components/ui/about-landing-page'
import { useTranslations, useLocale } from 'next-intl'

export default function AboutUsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navTranslations = {
    home: mounted ? t('nav.home') : 'Home',
    services: mounted ? t('nav.services') : 'Services',
    productions: mounted ? t('nav.productions') : 'Productions',
    aboutUs: mounted ? t('nav.aboutUs') : 'About Us',
    academy: mounted ? t('nav.academy') : 'Academy',
    contact: mounted ? t('nav.contact') : 'Contact',
    cta: mounted ? t('nav.cta') : "Let's Create",
  }

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a]">
        <Navbar translations={navTranslations} />
      </div>
    )
  }

  return (
    <div className="w-full light">
      <Navbar translations={navTranslations} />
      <TuringLanding />
    </div>
  )
}
