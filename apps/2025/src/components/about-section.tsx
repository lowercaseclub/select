"use client";

import { LocationMap } from "./location-map";

export function AboutSection() {
  return (
    <section className="flex flex-col lg:flex-row border-b">
      {/* Left content block with its own padding */}
      <div className="w-full lg:w-[50%] px-8 py-16 lg:py-24">
        <h2 className="text-2xl sm:text-3xl font-medium mb-6 lg:mb-8">
          About Supabase Select
        </h2>
        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg max-w-2xl">
          <p>
            Supabase Select is our first user conference, built for everyone
            building with Supabase—from weekend hackers to production-scale
            teams. If you&apos;re shipping software, this event is for you.
          </p>
          <p>
            Select is about giving builders the tools, knowledge, and confidence
            to move faster. You&apos;ll learn how teams are scaling with
            Postgres, shipping AI features in days not months, and taking full
            advantage of the Supabase stack.
          </p>
          <p>
            Whether you&apos;re just getting started or managing infrastructure
            at scale, you&apos;ll leave with practical insights, better
            workflows, and a stronger connection to the global builder
            community.
          </p>
          <p className="text-muted-foreground">
            The venue is easily accessible by public transit and rideshare.
            Street parking is limited, so we recommend using public
            transportation or rideshare services.
          </p>
          <div className="mt-4">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Y%20Combinator%2C%20580%2020th%20St%2C%20San%20Francisco%2C%20CA%2094107"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent-1-foreground hover:underline"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>

      {/* Divider - horizontal on mobile, vertical on desktop */}
      <div className="h-px lg:h-auto lg:w-px bg-column-lines"></div>

      {/* Right content block with its own padding */}
      <div className="w-full lg:w-[50%]">
        <LocationMap />
      </div>
    </section>
  );
}
