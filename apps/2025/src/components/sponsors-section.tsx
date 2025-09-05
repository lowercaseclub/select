import Image from "next/image";

export function SponsorsSection() {
  const sponsors = [
    {
      name: "Figma",
      logo: "/logos/figma.svg",
      url: "https://figma.com",
    },
    {
      name: "Resend",
      logo: "/logos/resend.svg",
      url: "https://resend.com",
    },
    {
      name: "Algolia",
      logo: "/logos/algolia.svg",
      url: "https://algolia.com",
    },
  ];

  return (
    <section id="sponsors" className="px-8 py-24">
      <div className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-medium mb-3 sm:mb-4">
          Sponsors
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground">
          Thank you to our sponsors for making Supabase Select possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 border border-column-lines w-full">
        {sponsors.map((sponsor, index) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-center px-4 py-12 sm:px-8 sm:py-16 transition-all duration-200 hover:bg-muted/50 ${
              index < 2 ? "lg:border-r border-column-lines" : ""
            } ${
              index < sponsors.length - 1
                ? "border-b lg:border-b-0 border-column-lines"
                : ""
            }`}
            aria-label={`Visit ${sponsor.name}`}
          >
            <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200 w-full flex items-center justify-center">
              <Image
                src={sponsor.logo}
                alt={`${sponsor.name} logo`}
                width={200}
                height={80}
                className="h-16 lg:h-20 w-full object-contain max-w-[160px] lg:max-w-[200px]"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
