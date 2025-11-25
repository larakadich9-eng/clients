import {
  Zap,
  Palette,
  TrendingUp,
  Sparkles,
  Laptop,
  Lightbulb,
  BookOpen,
  GraduationCap,
  LucideIcon,
} from 'lucide-react';

/**
 * Icon mapping for service cards
 * Maps icon identifiers to Lucide React icons
 */
export const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  palette: Palette,
  target: TrendingUp,
  'pen-tool': Sparkles,
  code: Laptop,
  brain: Lightbulb,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  zap: Zap,
};

/**
 * Get icon component by identifier
 * Returns Sparkles as fallback if icon not found
 */
export function getIcon(iconId: string): LucideIcon {
  return iconMap[iconId] || Sparkles;
}
