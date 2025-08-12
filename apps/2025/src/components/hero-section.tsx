"use client";

import { Button } from "@ui/components/button";

export function HeroSection() {
  return (
    <section className="px-8 py-48">
      <div className="flex flex-col gap-2">
        <p className="text-gray-400 text-3xl">Hosted with Y Combinator</p>

        <div className="">
          <h1 className="text-3xl ">
            <time dateTime="2025-10-03">Monday, October 3, 2025</time>
          </h1>
          <address className="text-3xl not-italic">
            Y Combinator,
            <br />
            580 20th St, San Francisco
          </address>
        </div>

        <p className="text-[#ebf22d] text-3xl  mb-12">
          Livestreamed at 10am PT
        </p>
        <div>
          <Button className="bg-[rgba(235,242,45,0.33)] border-2 border-dashed border-[#ebf22d] px-8 py-4 text-xl font-medium hover:bg-[rgba(235,242,45,0.5)] transition-colors rounded-none">
            Reserve Tickets
          </Button>
        </div>
      </div>
    </section>
  );
}
