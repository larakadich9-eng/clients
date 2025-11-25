'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Client {
  id: number
  name: string
  nameAr: string
  logo: string
  category: string
  categoryAr: string
  description: string
  descriptionAr: string
  website?: string
}

const clients: Client[] = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    nameAr: 'حلول تيك كوب',
    logo: '🏢',
    category: 'Enterprise Software',
    categoryAr: 'برمجيات المؤسسات',
    description: 'Leading enterprise software provider',
    descriptionAr: 'مزود برمجيات المؤسسات الرائد',
    website: 'https://example.com'
  },
  {
    id: 2,
    name: 'Digital Innovations Inc',
    nameAr: 'شركة الابتكارات الرقمية',
    logo: '💡',
    category: 'Digital Marketing',
    categoryAr: 'التسويق الرقمي',
    description: 'Innovative digital marketing solutions',
    descriptionAr: 'حلول التسويق الرقمي المبتكرة',
    website: 'https://example.com'
  },
  {
    id: 3,
    name: 'CloudFirst Systems',
    nameAr: 'أنظمة كلاود فيرست',
    logo: '☁️',
    category: 'Cloud Services',
    categoryAr: 'خدمات السحابة',
    description: 'Cloud infrastructure and services',
    descriptionAr: 'البنية التحتية والخدمات السحابية',
    website: 'https://example.com'
  },
  {
    id: 4,
    name: 'AI Ventures',
    nameAr: 'مشاريع الذكاء الاصطناعي',
    logo: '🤖',
    category: 'Artificial Intelligence',
    categoryAr: 'الذكاء الاصطناعي',
    description: 'AI-powered business solutions',
    descriptionAr: 'حلول الأعمال المدعومة بالذكاء الاصطناعي',
    website: 'https://example.com'
  },
  {
    id: 5,
    name: 'SecureNet Global',
    nameAr: 'سيكيور نت جلوبال',
    logo: '🔒',
    category: 'Cybersecurity',
    categoryAr: 'الأمن السيبراني',
    description: 'Enterprise security solutions',
    descriptionAr: 'حلول الأمان للمؤسسات',
    website: 'https://example.com'
  },
  {
    id: 6,
    name: 'DataFlow Analytics',
    nameAr: 'تحليلات تدفق البيانات',
    logo: '📊',
    category: 'Data Analytics',
    categoryAr: 'تحليل البيانات',
    description: 'Advanced data analytics platform',
    descriptionAr: 'منصة تحليل البيانات المتقدمة',
    website: 'https://example.com'
  },
  {
    id: 7,
    name: 'MobileFirst Apps',
    nameAr: 'تطبيقات موبايل فيرست',
    logo: '📱',
    category: 'Mobile Development',
    categoryAr: 'تطوير الجوال',
    description: 'Mobile app development services',
    descriptionAr: 'خدمات تطوير تطبيقات الجوال',
    website: 'https://example.com'
  },
  {
    id: 8,
    name: 'E-Commerce Pro',
    nameAr: 'متخصصو التجارة الإلكترونية',
    logo: '🛒',
    category: 'E-Commerce',
    categoryAr: 'التجارة الإلكترونية',
    description: 'E-commerce platform solutions',
    descriptionAr: 'حلول منصات التجارة الإلكترونية',
    website: 'https://example.com'
  },
  {
    id: 9,
    name: 'FinTech Innovations',
    nameAr: 'ابتكارات التكنولوجيا المالية',
    logo: '💳',
    category: 'Financial Technology',
    categoryAr: 'التكنولوجيا المالية',
    description: 'Fintech solutions and services',
    descriptionAr: 'حلول وخدمات التكنولوجيا المالية',
    website: 'https://example.com'
  },
  {
    id: 10,
    name: 'HealthTech Solutions',
    nameAr: 'حلول تكنولوجيا الصحة',
    logo: '🏥',
    category: 'Healthcare Technology',
    categoryAr: 'تكنولوجيا الرعاية الصحية',
    description: 'Healthcare technology platform',
    descriptionAr: 'منصة تكنولوجيا الرعاية الصحية',
    website: 'https://example.com'
  },
  {
    id: 11,
    name: 'EduTech Global',
    nameAr: 'إيدوتك جلوبال',
    logo: '🎓',
    category: 'Education Technology',
    categoryAr: 'تكنولوجيا التعليم',
    description: 'Educational technology solutions',
    descriptionAr: 'حلول تكنولوجيا التعليم',
    website: 'https://example.com'
  },
  {
    id: 12,
    name: 'GreenEnergy Tech',
    nameAr: 'تكنولوجيا الطاقة النظيفة',
    logo: '⚡',
    category: 'Renewable Energy',
    categoryAr: 'الطاقة المتجددة',
    description: 'Sustainable energy solutions',
    descriptionAr: 'حلول الطاقة المستدامة',
    website: 'https://example.com'
  }
]

interface ClientsGridProps {
  locale: string
}

export default function ClientsGrid({ locale }: ClientsGridProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isArabic = locale === 'ar'

  // Get unique categories
  const categories = Array.from(new Set(clients.map(c => isArabic ? c.categoryAr : c.category)))

  // Filter clients based on selected category
  const filteredClients = selectedCategory
    ? clients.filter(c => (isArabic ? c.categoryAr : c.category) === selectedCategory)
    : clients

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-6 transition-colors duration-300">
          {isArabic ? 'تصفية حسب الفئة' : 'Filter by Category'}
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {isArabic ? 'الكل' : 'All'}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredClients.map((client) => (
          <motion.div
            key={client.id}
            variants={itemVariants}
            onMouseEnter={() => setHoveredId(client.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative"
          >
            <div className="h-full p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl dark:hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transform hover:scale-105 hover:-translate-y-2">
              {/* Logo */}
              <div className="mb-6 flex justify-center">
                <div className="text-6xl transition-transform duration-300 group-hover:scale-110">
                  {client.logo}
                </div>
              </div>

              {/* Client Name */}
              <h3 className="text-xl font-bold text-black dark:text-white mb-2 text-center transition-colors duration-300">
                {isArabic ? client.nameAr : client.name}
              </h3>

              {/* Category Badge */}
              <div className="mb-4 flex justify-center">
                <span className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full transition-colors duration-300">
                  {isArabic ? client.categoryAr : client.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed transition-colors duration-300">
                {isArabic ? client.descriptionAr : client.description}
              </p>

              {/* Hover Effect - Visit Button */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300">
                  {isArabic ? 'زيارة الموقع' : 'Visit Website'}
                </button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-300">
            {isArabic ? 'لا توجد عملاء في هذه الفئة' : 'No clients in this category'}
          </p>
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-300">
              {clients.length}+
            </div>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {isArabic ? 'عميل نشط' : 'Active Clients'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-300">
              {categories.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {isArabic ? 'فئات الصناعة' : 'Industry Categories'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-300">
              100%
            </div>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {isArabic ? 'معدل الرضا' : 'Satisfaction Rate'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
