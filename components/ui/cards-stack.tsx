'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface CardStickyProps {
  index: number
  incrementY?: number
  incrementZ?: number
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const ContainerScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('relative w-full', className)}
      style={{ perspective: '1000px', overflow: 'visible', filter: 'drop-shadow(0 0 0 transparent)', ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
})
ContainerScroll.displayName = 'ContainerScroll'

const CardSticky = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      index,
      incrementY = 10,
      incrementZ = 10,
      children,
      className,
      style,
    },
    ref
  ) => {
    const z = 1 + index * incrementZ

    return (
      <motion.div
        ref={ref}
        layout="position"
        style={{
          zIndex: z,
          backfaceVisibility: 'hidden',
          ...style,
        } as React.CSSProperties}
        className={cn('sticky', className)}
      >
        {children}
      </motion.div>
    )
  }
)
CardSticky.displayName = 'CardSticky'

export { ContainerScroll, CardSticky }
