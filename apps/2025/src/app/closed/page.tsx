import type { Metadata } from 'next'
import Logo from '@/components/logo'

// Where to point visitors now that the 2025 event has ended. Update this to the
// live event URL (e.g. the 2026 site) once it's deployed.
const CURRENT_EVENT_URL = 'https://supabase.com'

export const metadata: Metadata = {
  title: 'Supabase Select 2025 has ended',
  description: 'The 2025 Supabase Select event has concluded.',
  robots: { index: false, follow: false },
}

export default function ClosedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 text-center">
      <div className="h-7 w-auto text-foreground">
        <Logo />
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Select 2025 has wrapped.
        </h1>
        <p className="mx-auto max-w-md text-balance text-muted-foreground">
          Thanks to everyone who joined us. This year&rsquo;s event has ended and
          the site is no longer live.
        </p>
      </div>

      <a
        href={CURRENT_EVENT_URL}
        className="font-mono text-sm text-brand-green-link underline-offset-4 hover:underline"
      >
        supabase.com &rarr;
      </a>
    </div>
  )
}
