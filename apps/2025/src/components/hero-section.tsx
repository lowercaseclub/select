"use client";

export function HeroSection() {
  const handleReserveTickets = () => {
    // TODO: Integrate with Bizzabo Partner API
    alert("Redirecting to ticket reservation...");
  };

  return (
    <main className="px-8 py-16">
      <div className="max-w-2xl">
        <p className="text-gray-400 text-xl font-medium">
          Hosted with Y Combinator
        </p>

        <div className="">
          <h2 className="text-2xl font-medium">Monday, October 3, 2025</h2>
          <p className="text-2xl font-medium">
            Y Combinator,
            <br />
            580 20th St, San Francisco
          </p>
        </div>

        <p className="text-[#ebf22d] text-2xl font-medium mb-12">
          Livestreamed at 10am PT
        </p>

        <button
          onClick={handleReserveTickets}
          className="bg-[rgba(235,242,45,0.33)] border-2 border-dashed border-[#ebf22d] px-8 py-4 text-xl font-medium hover:bg-[rgba(235,242,45,0.5)] transition-colors"
        >
          Reserve Tickets
        </button>
      </div>
    </main>
  );
}
