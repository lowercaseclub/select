"use client";

import { ApplicationForm } from "./application-form";

export function HeroSection() {
  return (
    <section className="px-8 py-48">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[#3ECF8E] text-3xl">
            Build in a Weekend. Scale to Millions.
          </span>
          <span className="text-red-500 text-3xl relative">
            Live
            <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-20 blur-sm"></div>
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-white text-3xl mb-2">
            <time dateTime="2025-10-03">Friday, October 3, 2025</time>
          </h1>
          <p className="text-white text-3xl">Doors open at 9am.</p>
        </div>

        <div className="mb-12">
          <p className="text-white text-3xl">
            Hosted at Y Combinator Headquarters
          </p>
          <address className="text-white text-3xl not-italic">
            580 20th St., San Francisco
          </address>
        </div>

        <div>
          <ApplicationForm />
        </div>
      </div>
    </section>
  );
}
