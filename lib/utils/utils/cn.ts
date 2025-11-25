/**
 * Utility function to merge class names
 * Handles conditional classes and removes duplicates
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter((cls) => typeof cls === 'string' && cls.length > 0)
    .join(' ');
}
