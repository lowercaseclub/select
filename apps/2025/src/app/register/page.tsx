"use client";

import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import { ContentWrapper } from "../../components/content-wrapper";
import { TopLines } from "@/components/top-lines";
import { AnimatedGrid } from "../../components/animated-grid";
import Link from "next/link";
import { useEffect } from "react";

export default function RegisterPage() {
  useEffect(() => {
    // Load Bizzabo script on client side only
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id =
      "bz-popup-registration-script-ae887e03-ee3b-4c94-be05-54d63f30b781";
    script.setAttribute("data-event-id", "752577");
    script.setAttribute("data-registration-proxy", "true");
    script.setAttribute("data-unique-name", "752577");
    script.setAttribute("data-flow-id", "ae887e03-ee3b-4c94-be05-54d63f30b781");
    script.setAttribute("data-inline-widget", "true");
    script.setAttribute("data-element-id", "start-registration-button");
    script.setAttribute("data-element-class", "");

    // Add the script content directly
    script.innerHTML = `
      (function() {
        var bz = document.createElement("script");
        bz.type = "text/javascript";
        bz.async = true;
        bz.setAttribute("data-flow-id","ae887e03-ee3b-4c94-be05-54d63f30b781")
        bz.setAttribute("data-inline-widget", "true")
        bz.src = "https://organizer.bizzabo.com/widgets/flows/popup/registrationPopup.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bz, s);
      })();
    `;

    document.head.appendChild(script);
  }, []);

  return (
    <>
      <ContentWrapper>
        <TopLines />
        <div className="relative border-b">
          <div className="absolute top-32 left-0 right-0 bottom-0">
            <AnimatedGrid />
          </div>
          <div className="relative z-10">
            <Header />
            <div className="px-8 pb-16 pt-8">
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
                  Register for Supabase Select
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  If you&apos;ve been accepted into the conference, you can
                  begin your registration process now.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  If you&apos;re not yet accepted into the conference, but would
                  like to attend,{" "}
                  <Link
                    href="/"
                    className="text-primary hover:text-primary/80 underline underline-offset-4"
                  >
                    be sure to apply
                  </Link>
                  .
                </p>
                <button
                  id="start-registration-button"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                >
                  Start registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
      <Footer />
    </>
  );
}
