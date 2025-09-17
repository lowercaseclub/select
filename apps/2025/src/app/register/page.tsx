"use client";

import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import { ContentWrapper } from "../../components/content-wrapper";
import { TopLines } from "@/components/top-lines";
import { CrosshairButton } from "../../components/crosshair-button";
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
          <div className="relative z-10">
            <Header />
            <section className="px-8 py-48">
              <div className="mb-12 sm:mb-16 flex flex-col gap-8">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
                  Register for Supabase Select
                </h2>
                <div>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    If you&apos;ve been accepted into the conference, you can
                    begin your registration process now.
                  </p>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    If you&apos;re not yet accepted into the conference, but
                    would like to attend,{" "}
                    <Link
                      href="/"
                      className="text-accent-1-foreground hover:text-accent-1-foreground/80 underline underline-offset-4"
                    >
                      be sure to apply
                    </Link>
                    .
                  </p>
                </div>
                <div>
                  <CrosshairButton
                    id="start-registration-button"
                    className="bg-accent-1-foreground/20 border border-dashed border-accent-1-foreground/30 text-2xl font-medium hover:bg-accent-1-foreground/80 hover:border-accent-1-foreground/60 transition-all duration-300 rounded-none text-white h-14 px-12"
                    crosshairColor="var(--accent-1-foreground)"
                    size="lg"
                  >
                    Start registration
                  </CrosshairButton>
                </div>
              </div>
            </section>
          </div>
        </div>
      </ContentWrapper>
      <Footer />
    </>
  );
}
