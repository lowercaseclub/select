"use client";

import { AnimatedGrid } from "./animated-grid";

export function AboutSection() {
  return (
    <section className="flex border-b">
      {/* Left content block with its own padding */}
      <div className="w-[45%] px-8 py-24">
        <h2 className="text-3xl font-medium mb-8">About the Event</h2>
        <div className="space-y-6 text-lg">
          <p>
            Join us for an exclusive gathering of innovators, entrepreneurs, and
            industry leaders as we explore the future of technology and
            startups.
          </p>
          <p>
            This curated event brings together the brightest minds from Y
            Combinator's portfolio companies and the broader tech ecosystem for
            an afternoon of insights, networking, and collaboration.
          </p>
          <p>
            Experience cutting-edge presentations, interactive workshops, and
            meaningful connections that will shape the next wave of innovation.
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
