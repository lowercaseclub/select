"use client";

import { AnimatedGrid } from "./animated-grid";

export function AboutSection() {
  return (
    <section className="flex border-b">
      {/* Left content block with its own padding */}
      <div className="w-[45%] px-8 py-24">
        <h2 className="text-3xl font-medium mb-8">About Supabase Select</h2>
        <div className="space-y-6 text-lg">
          <p>
            Supabase Select is our first user conference, built for everyone
            building with Supabase—from weekend hackers to production-scale teams.
            If you're shipping software, this event is for you.
          </p>
          <p>
            Select is about giving builders the tools, knowledge, and confidence
            to move faster. You'll learn how teams are scaling with Postgres,
            shipping AI features in days not months, and taking full advantage
            of the Supabase stack.
          </p>
          <p>
            Whether you're just getting started or managing infrastructure at
            scale, you'll leave with practical insights, better workflows, and a
            stronger connection to the global builder community.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-column-lines"></div>

      {/* Right content block with its own padding */}
      <div className="w-[55%] px-8 py-24">
        <h3 className="text-2xl font-medium mb-8">Event Layout</h3>
        <div className="relative aspect-square border border-column-lines bg-background">
          {/* Container for the isometric grid view */}
          <div className="absolute inset-4">
            <AnimatedGrid />
          </div>

          {/* Legend/Labels */}
          <div className="absolute bottom-4 left-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-muted-foreground bg-background"></div>
              <span>Event Areas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-column-lines"></div>
              <span>Pathways</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
