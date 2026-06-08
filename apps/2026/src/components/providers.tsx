'use client'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * App-wide client providers. PostHog is initialised in instrumentation-client.ts.
 * The 2026 site is light-mode only, so no theme provider is needed.
 */
export function Providers({ children }: ProvidersProps) {
  return <>{children}</>
}
