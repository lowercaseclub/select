import { ContentWrapper } from "../../components/content-wrapper";
import { Header } from "../../components/header";
import { TopLines } from "../../components/top-lines";
import { SpeakForm } from "../../components/speak-form";
import { Footer } from "../../components/footer";

export default function SpeakPage() {
  return (
    <>
      <ContentWrapper>
        <TopLines />
        <div className="relative border-b">
          <div className="relative z-10">
            <Header />
            <section className="px-8 pt-24 pb-[366px] md:py-56 xl:py-72">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Hero Text */}
                <div className="flex flex-col gap-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium">
                    Speak at Supabase Events
                  </h1>
                  <div className="space-y-4 text-lg md:text-xl text-muted-foreground">
                    <p>
                      Interested in speaking at Supabase Select, or any other
                      Supabase event? Fill out the form.
                    </p>
                    <p>
                      We are interested in talks that are original,
                      entertaining, and highly technical. The audience at our
                      events are database developers and builders.
                    </p>
                    <p>
                      Note: the agenda is very limited at Supabase Select. If
                      your talk is not chosen, indicate if you&apos;d be
                      interested in speaking at future events.
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="lg:sticky lg:top-8">
                  <SpeakForm />
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
