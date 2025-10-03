'use client'

import { useEffect, useRef, useCallback } from 'react'

export function useHeaderHeight() {
  const headerRef = useRef<HTMLElement>(null)

  const updateHeaderHeight = useCallback(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight
      document.documentElement.style.setProperty('--header-height', `${height}px`)
    }
  }, [])

  useEffect(() => {
    // Initial measurement with a small delay to ensure DOM is ready
    const initialTimeout = setTimeout(updateHeaderHeight, 0)

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateHeaderHeight, 100) // 100ms debounce
    }

    // Listen for resize events
    window.addEventListener('resize', debouncedResize)

    // Also listen for orientation change on mobile
    window.addEventListener('orientationchange', debouncedResize)

    // Listen for font loading events that might affect header height
    document.addEventListener('fontload', debouncedResize)

    // Cleanup
    return () => {
      clearTimeout(initialTimeout)
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('orientationchange', debouncedResize)
      document.removeEventListener('fontload', debouncedResize)
    }
  }, [updateHeaderHeight])

  return headerRef
}
