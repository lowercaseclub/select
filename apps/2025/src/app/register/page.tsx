import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import { ContentWrapper } from "../../components/content-wrapper";
import { TopLines } from "@/components/top-lines";
import { AnimatedGrid } from "../../components/animated-grid";

export default function RegisterPage() {
  return (
    <>
      <ContentWrapper>
        <TopLines />
        <div className="relative border-b">
          <div className="absolute top-32 left-0 right-0 bottom-0">
            <AnimatedGrid />
          </div>
          <div className="relative z-1">
            <Header />
            <div className="px-8 pb-16 pt-8">
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
                  Register for Supabase Select
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  If you've been accepted into the conference, you can begin
                  your registration process now.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  If you're not yet accepted into the conference, but would like
                  to attend,{" "}
                  <a
                    href="/"
                    className="text-primary hover:text-primary/80 underline underline-offset-4"
                  >
                    be sure to apply
                  </a>
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

      {/* Bizzabo "Register for Ticket" Registration Flow Widget Begin */}
      <script
        type="text/javascript"
        id="bz-popup-registration-script-ae887e03-ee3b-4c94-be05-54d63f30b781"
        data-event-id="752577"
        data-registration-proxy="true"
        data-unique-name="752577"
        data-flow-id="ae887e03-ee3b-4c94-be05-54d63f30b781"
        data-inline-widget="true"
        data-element-id="start-registration-button"
        data-element-class=""
        dangerouslySetInnerHTML={{
          __html: `
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
          `,
        }}
      />
      {/* Bizzabo "Register for Ticket" Registration Flow Widget End */}
    </>
  );
}
