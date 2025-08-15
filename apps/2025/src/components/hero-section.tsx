"use client";

import { CrosshairButton } from "./crosshair-button";
import { ApplicationForm } from "./application-form";

export function HeroSection() {
  return (
    <>
      <section className="px-8 pt-24 pb-[366px] md:py-56 xl:py-72">
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

          <p className="text-accent-1-foreground text-3xl  mb-12">
            Livestreamed at 10am PT
          </p>
          <div>
            <ApplicationForm
              trigger={
                <CrosshairButton
                  className="bg-accent-1-foreground/20 border border-dashed border-accent-1-foreground/30 text-base font-medium hover:bg-accent-1-foreground/80 hover:border-accent-1-foreground/60 transition-all duration-300 rounded-none text-white"
                  crosshairColor="var(--accent-1-foreground)"
                  crosshairSize={4}
                >
                  Apply Now
                </CrosshairButton>
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}
