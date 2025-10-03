/**
 * Utility functions for working with the header height CSS variable
 */

/**
 * Get the current header height value from the CSS variable
 * @returns The header height in pixels as a number
 */
export function getHeaderHeight(): number {
  if (typeof window === 'undefined') return 0

  const headerHeight = getComputedStyle(document.documentElement).getPropertyValue(
    '--header-height'
  )

  return parseFloat(headerHeight) || 0
}

/**
 * Get the current header height value as a CSS string
 * @returns The header height as a CSS string (e.g., "64px")
 */
export function getHeaderHeightCSS(): string {
  if (typeof window === 'undefined') return '0px'

  return getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '0px'
}

/**
 * CSS class that applies the header height as top margin
 * Use this in your Tailwind classes: `mt-[var(--header-height)]`
 */
export const HEADER_HEIGHT_CLASSES = {
  marginTop: 'mt-[var(--header-height)]',
  paddingTop: 'pt-[var(--header-height)]',
  top: 'top-[var(--header-height)]',
  height: 'h-[var(--header-height)]',
} as const
