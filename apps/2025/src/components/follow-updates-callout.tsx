import { XLogo } from './x-logo'

export function FollowUpdatesCallout() {
  return (
    <section className="px-8 py-12">
      <div className="max-w-2xl relative z-10">
        <div className="bg-muted/50 border border-column-lines border-l-foreground px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <XLogo className="w-5 h-5 text-foreground" />
              <h3 className="text-xl sm:text-2xl font-medium">Follow for Updates</h3>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed text-left">
              We&apos;re announcing new speakers regularly on{' '}
              <a
                href="https://x.com/supabase"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline font-medium transition-colors"
              >
                @supabase
              </a>
              . <br />
              Follow us to be the first to know when we reveal the next speaker lineup.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
