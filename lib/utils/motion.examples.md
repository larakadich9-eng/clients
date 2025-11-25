# Motion System Usage Examples

This document provides examples of how to use the ORNINA motion system utilities.

## Basic Usage

### Fade In Animation

```tsx
import { motion } from 'framer-motion';
import { fadeIn, conditionalVariant } from '@/lib/utils/motion';

function MyComponent() {
  return (
    <motion.div
      variants={conditionalVariant(fadeIn)}
      initial="hidden"
      animate="visible"
    >
      Content fades in smoothly
    </motion.div>
  );
}
```

### Slide In Animations

```tsx
import { motion } from 'framer-motion';
import { slideInFromBottom, slideInFromLeft, conditionalVariant } from '@/lib/utils/motion';

function MyComponent() {
  return (
    <>
      <motion.div
        variants={conditionalVariant(slideInFromBottom)}
        initial="hidden"
        animate="visible"
      >
        Slides in from bottom
      </motion.div>

      <motion.div
        variants={conditionalVariant(slideInFromLeft)}
        initial="hidden"
        animate="visible"
      >
        Slides in from left
      </motion.div>
    </>
  );
}
```

### Scale Animation

```tsx
import { motion } from 'framer-motion';
import { scale, conditionalVariant } from '@/lib/utils/motion';

function MyComponent() {
  return (
    <motion.div
      variants={conditionalVariant(scale)}
      initial="hidden"
      animate="visible"
    >
      Scales up smoothly
    </motion.div>
  );
}
```

## Hover Effects

### Scale Up on Hover

```tsx
import { motion } from 'framer-motion';
import { scaleUp, conditionalVariant, willChange } from '@/lib/utils/motion';

function MyButton() {
  return (
    <motion.button
      variants={conditionalVariant(scaleUp)}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      style={willChange.transform}
    >
      Hover me!
    </motion.button>
  );
}
```

### Glow Effect on Hover

```tsx
import { motion } from 'framer-motion';
import { glow, conditionalVariant } from '@/lib/utils/motion';

function MyCard() {
  return (
    <motion.div
      variants={conditionalVariant(glow)}
      initial="initial"
      whileHover="hover"
      className="p-6 rounded-lg backdrop-blur-lg bg-white/10"
    >
      Card with glow effect
    </motion.div>
  );
}
```

### Text Glow Effect

```tsx
import { motion } from 'framer-motion';
import { textGlow, conditionalVariant } from '@/lib/utils/motion';

function MyLink() {
  return (
    <motion.a
      href="#"
      variants={conditionalVariant(textGlow)}
      initial="initial"
      whileHover="hover"
    >
      Link with text glow
    </motion.a>
  );
}
```

## Stagger Animations

### Stagger Container with Items

```tsx
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, conditionalVariant } from '@/lib/utils/motion';

function MyList() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  return (
    <motion.ul
      variants={conditionalVariant(staggerContainer)}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={conditionalVariant(staggerItem)}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Custom Stagger Configuration

```tsx
import { motion } from 'framer-motion';
import { createStagger, slideInFromBottom } from '@/lib/utils/motion';

function MyGrid() {
  const items = Array.from({ length: 9 }, (_, i) => `Item ${i + 1}`);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={createStagger(0.1)} // 100ms delay between items
      className="grid grid-cols-3 gap-4"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={slideInFromBottom}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

## Navbar-Specific Animations

### Navbar Entrance

```tsx
import { motion } from 'framer-motion';
import { navbarEntrance, conditionalVariant, willChange } from '@/lib/utils/motion';

function Navbar() {
  return (
    <motion.nav
      variants={conditionalVariant(navbarEntrance)}
      initial="hidden"
      animate="visible"
      style={willChange.transformOpacity}
    >
      {/* Navbar content */}
    </motion.nav>
  );
}
```

### Navbar Link Hover

```tsx
import { motion } from 'framer-motion';
import { navbarLink, conditionalVariant, willChange } from '@/lib/utils/motion';

function NavLink({ href, children }) {
  return (
    <motion.a
      href={href}
      variants={conditionalVariant(navbarLink)}
      initial="initial"
      whileHover="hover"
      style={willChange.transformOpacity}
    >
      {children}
    </motion.a>
  );
}
```

### Mobile Menu Animation

```tsx
import { motion } from 'framer-motion';
import { mobileMenuLTR, mobileMenuRTL, mobileMenuItem, conditionalVariant, willChange } from '@/lib/utils/motion';

function MobileMenu({ isOpen, direction = 'ltr' }) {
  const menuVariants = direction === 'rtl' ? mobileMenuRTL : mobileMenuLTR;
  const links = ['Home', 'Services', 'Academy', 'Contact'];

  return (
    <motion.div
      variants={conditionalVariant(menuVariants)}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      style={willChange.transformOpacity}
    >
      {links.map((link, index) => (
        <motion.a
          key={link}
          href={`#${link.toLowerCase()}`}
          variants={conditionalVariant(mobileMenuItem(index))}
          style={willChange.transformOpacity}
        >
          {link}
        </motion.a>
      ))}
    </motion.div>
  );
}
```

## GPU Acceleration

### Using willChange for Performance

```tsx
import { motion } from 'framer-motion';
import { willChange } from '@/lib/utils/motion';

function OptimizedComponent() {
  return (
    <>
      {/* Transform only */}
      <motion.div style={willChange.transform}>
        Optimized for transform animations
      </motion.div>

      {/* Opacity only */}
      <motion.div style={willChange.opacity}>
        Optimized for opacity animations
      </motion.div>

      {/* Both transform and opacity */}
      <motion.div style={willChange.transformOpacity}>
        Optimized for both
      </motion.div>

      {/* Remove will-change after animation */}
      <motion.div
        style={willChange.transform}
        onAnimationComplete={() => {
          // Reset will-change to auto
          element.style.willChange = 'auto';
        }}
      >
        Will-change removed after animation
      </motion.div>
    </>
  );
}
```

### Custom GPU-Accelerated Transition

```tsx
import { motion } from 'framer-motion';
import { gpuTransition, timing, easing } from '@/lib/utils/motion';

function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={gpuTransition(timing.state, easing.easeOut)}
    >
      GPU-accelerated animation
    </motion.div>
  );
}
```

## Accessibility & Reduced Motion

### Conditional Animations

The `conditionalVariant` function automatically respects user preferences:

```tsx
import { motion } from 'framer-motion';
import { slideInFromBottom, conditionalVariant } from '@/lib/utils/motion';

function AccessibleComponent() {
  // Animation will be disabled if user prefers reduced motion
  return (
    <motion.div
      variants={conditionalVariant(slideInFromBottom)}
      initial="hidden"
      animate="visible"
    >
      Respects prefers-reduced-motion
    </motion.div>
  );
}
```

### Custom Reduced Motion Variant

```tsx
import { motion } from 'framer-motion';
import { conditionalVariant } from '@/lib/utils/motion';

const myAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const reducedMotionVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function MyComponent() {
  return (
    <motion.div
      variants={conditionalVariant(myAnimation, reducedMotionVariant)}
      initial="hidden"
      animate="visible"
    >
      Custom reduced motion behavior
    </motion.div>
  );
}
```

### Manual Motion Detection

```tsx
import { shouldDisableAnimations, prefersReducedMotion, isLowEndDevice } from '@/lib/utils/motion';

function MyComponent() {
  const disableAnimations = shouldDisableAnimations();
  const reducedMotion = prefersReducedMotion();
  const lowEnd = isLowEndDevice();

  return (
    <div>
      {disableAnimations ? (
        <div>Static content</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Animated content
        </motion.div>
      )}
    </div>
  );
}
```

## Timing & Easing

### Using Standard Timing

```tsx
import { motion } from 'framer-motion';
import { timing, easing } from '@/lib/utils/motion';

function MyComponent() {
  return (
    <>
      {/* Micro-interaction (150ms) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        transition={{ duration: timing.micro, ease: easing.sharpOut }}
      >
        Quick hover
      </motion.button>

      {/* State change (300ms) */}
      <motion.div
        animate={{ opacity: 1 }}
        transition={{ duration: timing.state, ease: easing.easeInOut }}
      >
        State change
      </motion.div>

      {/* Scroll animation (250ms) */}
      <motion.div
        animate={{ y: 0 }}
        transition={{ duration: timing.scroll, ease: easing.easeOut }}
      >
        Scroll animation
      </motion.div>
    </>
  );
}
```

## Best Practices

1. **Always use `conditionalVariant`** to respect user preferences
2. **Add `willChange` for animated elements** to enable GPU acceleration
3. **Remove `willChange` after animations complete** to avoid performance issues
4. **Use standard timing values** for consistency across the app
5. **Only animate `transform` and `opacity`** for best performance
6. **Limit concurrent animations** to 3-4 elements maximum
7. **Test with reduced motion enabled** to ensure accessibility
8. **Use stagger animations sparingly** to avoid overwhelming users

## Performance Tips

- Use `transform: translateZ(0)` for GPU acceleration
- Avoid animating `width`, `height`, `top`, `left`, `right`, `bottom`
- Use `scale` instead of animating dimensions
- Use `translate` instead of animating position
- Limit the number of animated elements on screen
- Use `will-change` sparingly and remove after animation
- Test on low-end devices to ensure smooth performance
