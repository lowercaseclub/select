// Shared origin validation logic for CSRF and middleware
import { allowedOrigins } from './allowed-origins'

/**
 * Validates if a request origin/referer is allowed
 * @param origin - The Origin header value (can be null)
 * @param referer - The Referer header value (can be null)
 * @param enableLogging - Whether to log validation details (default: false)
 * @returns true if origin is valid, false otherwise
 */
export function isValidOrigin(
  origin: string | null,
  referer: string | null,
  enableLogging: boolean = false
): boolean {
  // Allow requests with no origin/referer (same-site requests)
  if (!origin && !referer) {
    if (enableLogging) {
      console.log('Origin validation: Allowing request with no origin/referer')
    }
    return true
  }

  let isValid = false

  // Check explicit origin match
  if (origin && allowedOrigins.includes(origin)) {
    if (enableLogging) {
      console.log('Origin validation: Origin matches allowed list:', origin)
    }
    isValid = true
  }

  // Check referer if origin check failed
  if (!isValid && referer) {
    try {
      const refererUrl = new URL(referer)
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`

      if (enableLogging) {
        console.log('Origin validation: Checking referer origin:', refererOrigin)
      }

      // Check explicit allowed origins
      if (allowedOrigins.includes(refererOrigin)) {
        if (enableLogging) {
          console.log('Origin validation: Referer origin matches allowed list')
        }
        isValid = true
      }

      // Check if referer (with trailing slash) starts with any allowed origin
      if (!isValid) {
        isValid = allowedOrigins.some((allowedOrigin) => {
          const match = referer.startsWith(allowedOrigin)
          if (match && enableLogging) {
            console.log('Origin validation: Referer starts with allowed origin:', allowedOrigin)
          }
          return match
        })
      }

      // Check for Vercel deployment pattern: select-*-supabase.vercel.app
      if (!isValid && refererOrigin.includes('.vercel.app')) {
        const isVercelPattern = /^https?:\/\/select-.*-supabase\.vercel\.app$/.test(refererOrigin)
        if (isVercelPattern) {
          if (enableLogging) {
            console.log('Origin validation: Allowing Vercel deployment pattern:', refererOrigin)
          }
          isValid = true
        }
      }
    } catch (error) {
      if (enableLogging) {
        console.log('Origin validation: Invalid referer URL:', error)
      }
    }
  }

  if (enableLogging && !isValid) {
    console.log('Origin validation failed:', {
      origin,
      referer,
      allowedOrigins,
    })
  }

  return isValid
}
