"use client";

import { CrosshairButton } from "./crosshair-button";
import { ApplicationForm } from "./application-form";

export function HeroSection() {
  return (
    <>
      <section className="px-8 pt-24 pb-[366px] md:py-48">
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
            <ApplicationForm
              trigger={
                <CrosshairButton
                  className="bg-[rgba(235,242,45,0.33)] border border-dashed border-[#ebf22d]/50 text-base font-medium hover:bg-[rgba(235,242,45,0.5)] transition-colors rounded-none text-white"
                  crosshairColor="#ebf22d"
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
