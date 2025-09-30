// Debug utility for conditional logging
const isDevelopment = process.env.NODE_ENV === 'development'
const DEBUG_ENABLED = false // Temporarily disabled to prevent console spam

export const debug = {
  log: (...args: unknown[]) => {
    if (isDevelopment && DEBUG_ENABLED) {
      console.log(...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment && DEBUG_ENABLED) {
      console.warn(...args)
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  info: (...args: unknown[]) => {
    if (isDevelopment && DEBUG_ENABLED) {
      console.info(...args)
    }
  },
}
