import { Suspense } from "react";

interface ApplicationVerifiedPageProps {
  searchParams: { email?: string };
}

function ApplicationVerifiedContent({ email }: { email?: string }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your application has been submitted
          </h1>
          <p className="text-xl text-gray-300">We will be in touch shortly.</p>
        </div>
      </div>
    </div>
  );
}

export default async function ApplicationVerifiedPage({
  searchParams,
}: ApplicationVerifiedPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationVerifiedContent email={searchParams.email} />
    </Suspense>
  );
}
