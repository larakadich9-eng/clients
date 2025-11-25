'use client'

import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import ClientsGrid from '@/components/main/clients-grid'

export default function ClientsPage() {
  const locale = useLocale()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isArabic = locale === 'ar'
  const isRTL = isArabic

  const translations = {
    en: {
      title: 'Our Clients',
      subtitle: 'Trusted by leading companies and organizations worldwide',
      description: 'We have had the privilege of working with innovative companies across various industries. Our clients range from startups to Fortune 500 companies, all united by their commitment to digital transformation and excellence.',
    },
    ar: {
      title: 'عملاؤنا',
      subtitle: 'موثوق به من قبل الشركات والمنظمات الرائدة في جميع أنحاء العالم',
      description: 'كان لدينا شرف العمل مع شركات مبتكرة عبر مختلف الصناعات. يتراوح عملاؤنا من الشركات الناشئة إلى شركات Fortune 500، جميعهم موحدون بالتزامهم بالتحول الرقمي والتميز.',
    }
  }

  const t = translations[isArabic ? 'ar' : 'en']

  if (!mounted) {
    return null
  }

  return (
    <main 
      className="min-h-screen bg-white dark:bg-black transition-colors duration-300"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-black dark:text-white transition-colors duration-300">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
              {t.subtitle}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-500 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              {t.description}
            </p>
          </div>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <ClientsGrid locale={locale} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white transition-colors duration-300">
            {isArabic ? 'هل أنت مهتم بالعمل معنا؟' : 'Interested in working with us?'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-300">
            {isArabic ? 'دعنا نساعدك في تحقيق أهدافك الرقمية' : 'Let us help you achieve your digital goals'}
          </p>
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
            {isArabic ? 'تواصل معنا' : 'Get in Touch'}
          </button>
        </div>
      </section>
    </main>
  )
}
