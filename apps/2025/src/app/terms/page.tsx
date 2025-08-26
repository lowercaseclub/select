import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import { ContentWrapper } from "../../components/content-wrapper";
import { TopLines } from "../../components/top-lines";

export const metadata = {
  title: "Terms of Service - Supabase Select",
  description: "Terms and conditions for attending Supabase Select 2025.",
};

export default function TermsPage() {
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
                  Terms of Service
                </h1>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="text-xl mb-8">
                    These Terms of Service govern your participation in Supabase
                    Select 2025. By attending the event, you agree to be bound
                    by these terms.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Event Registration and Attendance
                  </h2>
                  <p className="mb-6">
                    Registration for Supabase Select 2025 is required for
                    attendance. All registrations are subject to approval and
                    may be limited based on venue capacity and other factors.
                  </p>
                  <p className="mb-6">
                    Attendees must be 18 years of age or older, or accompanied
                    by a parent or legal guardian if under 18.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Code of Conduct
                  </h2>
                  <p className="mb-6">
                    All attendees must adhere to our Code of Conduct, which
                    promotes a respectful and inclusive environment. Violation
                    of the Code of Conduct may result in removal from the event
                    without refund.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Photography and Recording
                  </h2>
                  <p className="mb-6">
                    By attending Supabase Select, you consent to being
                    photographed, filmed, or recorded for promotional and
                    archival purposes. These materials may be used in various
                    media formats.
                  </p>
                  <p className="mb-6">
                    Personal photography and recording are permitted for
                    non-commercial use, but must not interfere with
                    presentations or other attendees&apos; experience.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Intellectual Property
                  </h2>
                  <p className="mb-6">
                    All content presented at Supabase Select, including but not
                    limited to presentations, materials, and discussions,
                    remains the intellectual property of the respective speakers
                    and contributors.
                  </p>
                  <p className="mb-6">
                    Attendees may not reproduce, distribute, or commercialize
                    event content without explicit permission from the content
                    owners.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Liability and Indemnification
                  </h2>
                  <p className="mb-6">
                    Supabase and event organizers are not liable for any
                    personal injury, property damage, or other losses incurred
                    during the event, except where such liability cannot be
                    excluded by law.
                  </p>
                  <p className="mb-6">
                    Attendees agree to indemnify and hold harmless Supabase and
                    event organizers from any claims arising from their
                    attendance or participation in the event.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Cancellation and Refunds
                  </h2>
                  <p className="mb-6">
                    Supabase reserves the right to cancel, postpone, or modify
                    the event due to circumstances beyond our control, including
                    but not limited to health emergencies, natural disasters, or
                    venue issues.
                  </p>
                  <p className="mb-6">
                    Refund policies will be communicated to registered attendees
                    in the event of cancellation or significant changes.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Privacy and Data Protection
                  </h2>
                  <p className="mb-6">
                    Your personal information will be collected and processed in
                    accordance with our Privacy Policy. By registering for the
                    event, you consent to the collection and use of your
                    information for event-related purposes.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Force Majeure
                  </h2>
                  <p className="mb-6">
                    Supabase shall not be liable for any failure or delay in
                    performance due to circumstances beyond our reasonable
                    control, including but not limited to acts of God,
                    government actions, war, civil disturbance, or other events
                    of force majeure.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Governing Law
                  </h2>
                  <p className="mb-6">
                    These Terms of Service shall be governed by and construed in
                    accordance with the laws of the jurisdiction in which
                    Supabase operates, without regard to conflict of law
                    principles.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Changes to Terms
                  </h2>
                  <p className="mb-6">
                    Supabase reserves the right to modify these Terms of Service
                    at any time. Changes will be effective immediately upon
                    posting. Continued attendance at the event constitutes
                    acceptance of any modified terms.
                  </p>

                  <h2 className="text-2xl font-medium text-foreground mt-12 mb-6">
                    Contact Information
                  </h2>
                  <p className="mb-6">
                    For questions about these Terms of Service, please contact
                    us at legal@supabase.com.
                  </p>

                  <p className="text-sm text-muted-foreground mt-12">
                    Last updated: December 2024
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
