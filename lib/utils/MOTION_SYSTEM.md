# ORNINA Motion System

A comprehensive, performance-optimized animation system built on Framer Motion for the ORNINA website.

## Overview

The motion system provides:
- ✅ Reusable animation variants for common patterns
- ✅ Consistent timing (150ms micro-interactions, 300ms state changes)
- ✅ Automatic `prefers-reduced-motion` detection
- ✅ GPU acceleration with `will-change` and `translateZ(0)`
- ✅ Custom easing functions for smooth, natural motion
- ✅ Navbar-specific animations with stagger effects
- ✅ Accessibility-first approach

## Features

### 1. Motion Detection

Automatically detects user preferences and device capabilities:

```typescript
import { shouldDisableAnimations, prefersReducedMotion, isLowEndDevice } from '@/lib/utils/motion';

// Check if animations should be disabled
const disabled = shouldDisableAnimations(); // true if reduced motion OR low-end device

// Individual checks
const reducedMotion = prefersReducedMotion(); // true if user prefers reduced motion
const lowEnd = isLowEndDevice(); // true if device has ≤4 CPU cores and ≤4GB RAM
```

### 2. Standard Timing

Consistent animation durations across the application:

```typescript
import { timing } from '@/lib/utils/motion';

timing.micro;  // 0.15s - Micro-interactions (hover, focus)
timing.state;  // 0.3s  - State changes (theme, language)
timing.scroll; // 0.25s - Scroll animations
timing.page;   // 0.4s  - Page transitions
```

### 3. Custom Easing Functions

Smooth, natural motion with custom cubic-bezier curves:

```typescript
import { easing } from '@/lib/utils/motion';

easing.easeOut;   // [0.16, 1, 0.3, 1]       - Smooth ease out for entrances
easing.easeInOut; // [0.43, 0.13, 0.23, 0.96] - Smooth ease in-out for state changes
easing.sharpOut;  // [0.34, 1.56, 0.64, 1]    - Sharp ease out for micro-interactions
easing.gentle;    // [0.25, 0.46, 0.45, 0.94] - Gentle ease for subtle movements
```

### 4. Reusable Animation Variants

Pre-built animation variants for common patterns:

#### Entrance Animations
- `fadeIn` - Simple fade in
- `slideInFromBottom` - Slide in from bottom with fade
- `slideInFromTop` - Slide in from top with fade
- `slideInFromLeft` - Slide in from left with fade
- `slideInFromRight` - Slide in from right with fade
- `scale` - Scale up with fade

#### Hover Effects
- `scaleUp` - Scale up on hover, scale down on tap
- `glow` - Box shadow glow effect on hover
- `textGlow` - Text shadow glow effect on hover

#### Stagger Animations
- `staggerContainer` - Parent container for stagger animations
- `staggerItem` - Child items that stagger in
- `createStagger(delay, direction)` - Custom stagger configuration

#### Navbar-Specific
- `navbarEntrance` - Navbar entrance animation with stagger
- `navbarLink` - Link hover animation with scale and glow
- `mobileMenuLTR` - Mobile menu slide-in from right (LTR)
- `mobileMenuRTL` - Mobile menu slide-in from left (RTL)
- `mobileMenuItem(index)` - Mobile menu item with custom delay

### 5. GPU Acceleration

Performance optimization utilities:

```typescript
import { willChange } from '@/lib/utils/motion';

// Apply to animated elements
<motion.div style={willChange.transform}>...</motion.div>
<motion.div style={willChange.opacity}>...</motion.div>
<motion.div style={willChange.transformOpacity}>...</motion.div>

// Remove after animation
<motion.div 
  style={willChange.transform}
  onAnimationComplete={() => {
    element.style.willChange = 'auto';
  }}
>
```

### 6. Conditional Variants

Automatically respects user preferences:

```typescript
import { conditionalVariant, fadeIn } from '@/lib/utils/motion';

// Animation will be disabled if user prefers reduced motion or has low-end device
<motion.div
  variants={conditionalVariant(fadeIn)}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>

// With custom reduced motion variant
const reducedVariant = { hidden: {}, visible: {} };
<motion.div
  variants={conditionalVariant(fadeIn, reducedVariant)}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

## Usage Examples

See [motion.examples.md](./motion.examples.md) for comprehensive usage examples.

### Quick Start

```tsx
import { motion } from 'framer-motion';
import { 
  fadeIn, 
  scaleUp, 
  conditionalVariant, 
  willChange 
} from '@/lib/utils/motion';

function MyComponent() {
  return (
    <motion.div
      variants={conditionalVariant(fadeIn)}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        variants={conditionalVariant(scaleUp)}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        style={willChange.transform}
      >
        Click me
      </motion.button>
    </motion.div>
  );
}
```

## Performance Guidelines

### ✅ DO

- Use `transform` and `opacity` for animations
- Apply `willChange` to animated elements
- Remove `willChange` after animations complete
- Use `conditionalVariant` for all animations
- Limit concurrent animations to 3-4 elements
- Test with reduced motion enabled
- Use standard timing values for consistency

### ❌ DON'T

- Animate `width`, `height`, `top`, `left`, `right`, `bottom`
- Leave `willChange` applied permanently
- Ignore user motion preferences
- Create custom timing without good reason
- Animate too many elements simultaneously
- Skip accessibility testing

## Browser Support

- Chrome/Edge: Last 2 versions ✅
- Firefox: Last 2 versions ✅
- Safari: Last 2 versions ✅
- Mobile Safari: iOS 14+ ✅
- Chrome Mobile: Android 10+ ✅

## Implementation Details

### GPU Acceleration

All animations use:
- `transform: translateZ(0)` for GPU layer promotion
- `will-change` hints for optimization
- Only `transform` and `opacity` properties

### Accessibility

- Automatic `prefers-reduced-motion` detection
- Conditional animation disabling
- Low-end device detection
- Fallback to instant transitions

### Performance

- GPU-accelerated animations
- Minimal JavaScript execution
- Efficient re-renders with Framer Motion
- Optimized for 60fps on all devices

## Testing

### Manual Testing

1. Enable "Reduce motion" in system preferences
2. Verify animations are disabled or simplified
3. Test on low-end devices (4 cores, 4GB RAM)
4. Check frame rate during animations (should be 60fps)

### Automated Testing

```typescript
import { shouldDisableAnimations } from '@/lib/utils/motion';

describe('Motion System', () => {
  it('should disable animations when user prefers reduced motion', () => {
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
    }));

    expect(shouldDisableAnimations()).toBe(true);
  });
});
```

## Migration Guide

### From Inline Variants

**Before:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

**After:**
```tsx
import { slideInFromBottom, conditionalVariant } from '@/lib/utils/motion';

<motion.div
  variants={conditionalVariant(slideInFromBottom)}
  initial="hidden"
  animate="visible"
>
```

### From Custom Timing

**Before:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
>
```

**After:**
```tsx
import { scaleUp, conditionalVariant, willChange } from '@/lib/utils/motion';

<motion.button
  variants={conditionalVariant(scaleUp)}
  initial="initial"
  whileHover="hover"
  whileTap="tap"
  style={willChange.transform}
>
```

## Contributing

When adding new animation variants:

1. Follow the existing pattern structure
2. Include GPU acceleration (`transform: translateZ(0)`)
3. Use standard timing values
4. Add TypeScript types
5. Document in examples file
6. Test with reduced motion enabled

## License

Part of the ORNINA website project.
