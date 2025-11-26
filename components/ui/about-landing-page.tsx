'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

const SQRT_5000 = Math.sqrt(5000)

const getTestimonials = (t: any) => [
  {
    tempId: 0,
    testimonial: t('aboutUs.cards.vision.content'),
    by: t('aboutUs.cards.vision.title'),
    imgSrc: "https://i.pravatar.cc/150?img=2"
  },
  {
    tempId: 1,
    testimonial: t('aboutUs.cards.about.content'),
    by: t('aboutUs.cards.about.title'),
    imgSrc: "https://i.pravatar.cc/150?img=1"
  },
  {
    tempId: 2,
    testimonial: t('aboutUs.cards.mission.content'),
    by: t('aboutUs.cards.mission.title'),
    imgSrc: "https://i.pravatar.cc/150?img=3"
  },
  {
    tempId: 3,
    testimonial: t('aboutUs.cards.vision.content'),
    by: t('aboutUs.cards.vision.title'),
    imgSrc: "https://i.pravatar.cc/150?img=4"
  },
  {
    tempId: 4,
    testimonial: t('aboutUs.cards.about.content'),
    by: t('aboutUs.cards.about.title'),
    imgSrc: "https://i.pravatar.cc/150?img=5"
  },
  {
    tempId: 5,
    testimonial: t('aboutUs.cards.mission.content'),
    by: t('aboutUs.cards.mission.title'),
    imgSrc: "https://i.pravatar.cc/150?img=6"
  }
]

interface TestimonialCardProps {
  position: number
  testimonial: ReturnType<typeof getTestimonials>[0]
  handleMove: (steps: number) => void
  cardSize: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 transition-all duration-500 ease-in-out backdrop-blur-md",
        "p-4 sm:p-6 md:p-8",
        isCenter 
          ? "z-[9999] bg-black/40 text-card-foreground border-gray-600/50" 
          : "z-[9998] bg-black/30 text-card-foreground border-gray-600/50 hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: cardSize < 300 
          ? `polygon(30px 0%, calc(100% - 30px) 0%, 100% 30px, 100% 100%, calc(100% - 30px) 100%, 30px 100%, 0 100%, 0 0)`
          : `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `translate(-50%, -50%) translateX(${(cardSize / 1.5) * position}px)translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)translateZ(${isCenter ? -400 : -700}px)rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)`,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent",
        transformStyle: 'preserve-3d',
        WebkitTransformStyle: 'preserve-3d'
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border hidden sm:block"
        style={{
          right: -2,
          top: cardSize < 300 ? 30 : 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <h2 className={cn("mb-2 sm:mb-4 text-xs sm:text-lg md:text-xl font-bold text-primary line-clamp-2", !isCenter && "pointer-events-none")} style={!isCenter && Math.abs(position) <= 1 ? { filter: 'blur(4px)' } : {}}>
        {testimonial.by}
      </h2>
      <h3 className={cn("text-xs sm:text-base md:text-xl font-medium line-clamp-4 sm:line-clamp-5", isCenter ? "text-primary-foreground" : "text-foreground", !isCenter && "pointer-events-none")} style={!isCenter && Math.abs(position) <= 1 ? { filter: 'blur(4px)' } : {}}>
        "{testimonial.testimonial}"
      </h3>
    </div>
  )
}

const TuringLandingComponent: React.FC = () => {
  const [cardSize, setCardSize] = useState(365)
  const t = useTranslations()
  const [testimonialsList, setTestimonialsList] = useState(() => getTestimonials(t))

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setTestimonialsList(newList)
  }

  useEffect(() => {
    const updateSize = () => {
      // Mobile: < 640px
      if (window.innerWidth < 640) {
        setCardSize(280)
      }
      // Tablet: 640px - 1024px
      else if (window.innerWidth < 1024) {
        setCardSize(340)
      }
      // Desktop: >= 1024px
      else {
        setCardSize(430)
      }
    }
    
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const containerHeight = cardSize + 200
  
  return (
    <div 
      className="relative w-full overflow-hidden dark:bg-muted/30" 
      style={{ 
        height: `${containerHeight}px`,
        perspective: '1200px', 
        background: 'linear-gradient(135deg, rgba(200, 200, 200, 0.3) 0%, rgba(150, 150, 150, 0.2) 50%, rgba(180, 180, 180, 0.25) 100%)', 
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2

        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        )
      })}

      {/* Navigation Buttons */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 flex -translate-x-1/2 gap-1 sm:gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center text-lg sm:text-2xl transition-colors",
            "bg-black/40 border-2 border-gray-600/50 backdrop-blur-md hover:bg-black/60 hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "active:scale-95"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={window.innerWidth < 640 ? 20 : 24} />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center text-lg sm:text-2xl transition-colors",
            "bg-black/40 border-2 border-gray-600/50 backdrop-blur-md hover:bg-black/60 hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "active:scale-95"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight size={window.innerWidth < 640 ? 20 : 24} />
        </button>
      </div>
    </div>
  )
}

export const TuringLanding = TuringLandingComponent
export const StaggerTestimonials = TuringLandingComponent
