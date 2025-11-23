/**
 * ELECTRIC ALCHEMIST: CLASS NAME UTILITY
 *
 * Combines clsx and tailwind-merge for optimal class name handling.
 * - clsx: Conditionally construct className strings
 * - tailwind-merge: Intelligently merge Tailwind classes (last one wins)
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind class deduplication
 *
 * @example
 * cn('px-4 py-2', 'px-6') // => 'py-2 px-6'
 * cn('text-hero', isActive && 'text-hero-irregular') // => 'text-hero text-hero-irregular'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
