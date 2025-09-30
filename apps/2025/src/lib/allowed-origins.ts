// Shared configuration for allowed origins across the application
// Used by middleware, CSRF validation, and other security checks

const allowedOrigins = [
  // Production domains
  'https://select.supabase.com',
  'http://select.supabase.com',
  'https://www.select.supabase.com',
  'http://www.select.supabase.com',
]

// Add Vercel deployment URLs
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`, `http://${process.env.VERCEL_URL}`)
}

// Add localhost for development
if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:3000', 'https://localhost:3000')
}

export { allowedOrigins }
