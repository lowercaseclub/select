import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import { ContentWrapper } from "../../components/content-wrapper";
import { TopLines } from "../../components/top-lines";

export const metadata = {
  title: "Code of Conduct - Supabase Select",
  description:
    "Our community guidelines and code of conduct for Supabase Select 2025.",
};

export default function CodeOfConductPage() {
  return (
    <>
      <ContentWrapper>
        <TopLines />
        <div className="relative border-b">
          <div className="relative z-10">
            <Header />
            <div className="py-24 px-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-medium mb-8">
                  Code of Conduct
                </h1>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="text-xl mb-8">
                    Supabase is committed to creating events where participants
                    feel welcome, respected, and safe. All attendees, speakers,
                    sponsors, and staff are expected to behave professionally
                    and courteously.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Expected Behavior
                  </h2>
                  <ul className="list-disc pl-6 mb-8 space-y-2">
                    <li>Treat all participants with respect.</li>
                    <li>
                      Avoid disruptive, intimidating, or inappropriate behavior.
                    </li>
                    <li>
                      Comply with all event and venue rules and instructions.
                    </li>
                  </ul>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Unacceptable Behavior
                  </h2>
                  <ul className="list-disc pl-6 mb-8 space-y-2">
                    <li>Harassment, threats, or discrimination of any kind.</li>
                    <li>Disruptive or aggressive conduct.</li>
                    <li>
                      Inappropriate or unwanted physical or verbal attention.
                    </li>
                  </ul>

                  <p className="mb-8">
                    Supabase reserves the right to take any action deemed
                    appropriate, including removal from the event without
                    refund, in response to violations of this policy.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Media and Photography
                  </h2>
                  <p className="mb-8">
                    By attending a Supabase event (in-person or virtual), you
                    consent to being photographed or recorded. Supabase may use
                    event media for promotional or documentation purposes.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Virtual Events and Online Conduct
                  </h2>
                  <p className="mb-6">
                    This Code also applies to virtual event spaces, including
                    livestreams, chats, forums, or video calls. Participants
                    must:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Use appropriate and respectful language.</li>
                    <li>Not spam, troll, or derail discussions.</li>
                    <li>
                      Refrain from sharing screenshots or recordings without
                      permission.
                    </li>
                  </ul>
                  <p className="mb-8">
                    Supabase may remove access for participants who violate
                    these terms.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Reporting
                  </h2>
                  <p className="mb-8">
                    If you experience or witness behavior that violates this
                    Code of Conduct, please report it to a member of the
                    Supabase staff. We will review and address all reports at
                    our discretion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
      <Footer />
    </>
  );
}
