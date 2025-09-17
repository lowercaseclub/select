import { TopLines } from "@/components/top-lines";
import { ContentWrapper } from "../../components/content-wrapper";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";

export default function ApplicationVerifiedPage() {
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
                  Application Submitted
                </h2>
                <div>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    We will be in touch shortly.
                  </p>
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
