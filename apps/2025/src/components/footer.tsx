export function Footer() {
  return (
    <footer className="w-full border-t border-column-lines py-16">
      <div className="max-w-site mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo/Brand section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-medium mb-4">Supabase Select</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where builders come to learn. Jam-packed with sessions from the
              industry&apos;s best builders.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="font-medium mb-4">Event</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#schedule"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Schedule
                </a>
              </li>
              <li>
                <a
                  href="#speakers"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Speakers
                </a>
              </li>
              <li>
                <a
                  href="/speak"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Speak at Select
                </a>
              </li>
              <li>
                <a
                  href="/code-of-conduct"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Code of Conduct
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-1">
            <h4 className="font-medium mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://twitter.com/supabase"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/supabase"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.supabase.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Contact/Location */}
          <div className="md:col-span-1">
            <h4 className="font-medium mb-4">Location</h4>
            <address className="text-sm text-muted-foreground not-italic leading-relaxed">
              Y Combinator
              <br />
              580 20th St
              <br />
              San Francisco, CA
            </address>
            <div className="mt-4">
              <time
                dateTime="2025-10-03"
                className="text-sm text-muted-foreground"
              >
                Friday, October 3, 2025
              </time>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-column-lines flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Supabase. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="https://supabase.com/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <a
              href="https://supabase.com/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
