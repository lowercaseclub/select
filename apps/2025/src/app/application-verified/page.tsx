import { TopLines } from "@/components/top-lines";
import { ContentWrapper } from "../../components/content-wrapper";
import { Header } from "../../components/header";

export default function ApplicationVerifiedPage() {
  return (
    <ContentWrapper>
      <Header />
      <TopLines />
      <section className="px-8 pt-24 pb-[366px] md:py-56 xl:py-72 border-b">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-medium">
              Your application has been submitted
            </h1>
            <p className="text-muted-foreground text-xl">
              We will be in touch shortly.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-accent-1-foreground text-lg">
              Thank you for your interest in Supabase Select. We&apos;re
              reviewing all applications and will notify you about next steps.
            </p>
          </div>
        </div>
      </section>
    </ContentWrapper>
  );
}
