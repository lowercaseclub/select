import Image from "next/image";
import { UsersIcon } from "@heroicons/react/24/outline";
import { LinkIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { getSpeakers } from "../lib/bizzabo-api";
import { BizzaboSpeaker } from "../types/bizzabo.types";
import { AnnouncingSoonTile } from "./announcing-soon-tile";

export async function SpeakersSection() {
  let speakers: BizzaboSpeaker[] = [];

  try {
    speakers = await getSpeakers();
    // Debug: Speakers data loaded successfully
  } catch {
    // Error handled gracefully - empty speakers array will be used
    speakers = [];
  }

  // Add placeholder "Announcing Soon" tiles based on env var
  const announcingSoonCount = parseInt(
    process.env.ANNOUNCING_SOON_SPEAKERS || "0",
    10
  );

  return (
    <section id="speakers" className="px-8 pt-24 pb-0">
      <div className="mb-12 sm:mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-3 sm:mb-4">
          Featured Speakers
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground">
          Learn from industry leaders and successful founders who are shaping
          the future of technology.
        </p>
      </div>

      {(speakers.length === 0 && announcingSoonCount === 0) ||
      (speakers.length > 0 &&
        speakers.every(
          (speaker) =>
            !speaker.firstname &&
            !speaker.lastname &&
            !speaker.bio &&
            !speaker.title
        )) ? (
        <div className="text-center py-16">
          <div className="mb-4">
            <div className="w-16 h-16 bg-muted border border-column-lines rounded-lg mx-auto mb-4 flex items-center justify-center">
              <UsersIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-medium mb-2">No Speakers Available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Speaker information is currently being updated. Please check back
            soon for our amazing lineup of industry leaders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="space-y-3 sm:space-y-4">
              <div className="aspect-square bg-muted border border-column-lines relative overflow-hidden">
                {speaker.photoSet?.large && (
                  <Image
                    src={speaker.photoSet.large}
                    alt={`${speaker.firstname} ${speaker.lastname}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105 filter grayscale contrast-125"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-medium leading-tight">
                    {speaker.prefix && `${speaker.prefix} `}
                    {speaker.firstname} {speaker.lastname}
                  </h3>
                  {speaker.title && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-snug">
                      {speaker.title}
                      {""}
                      <span className="text-muted-foreground">
                        , {speaker.company}
                      </span>
                    </p>
                  )}
                </div>
                {/* Social Links */}
                {(speaker.linkedIn ||
                  speaker.twitterHandle ||
                  speaker.web ||
                  speaker.blog) && (
                  <div className="flex gap-2">
                    {speaker.linkedIn && (
                      <a
                        href={speaker.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 -m-1"
                        title="LinkedIn"
                      >
                        <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </a>
                    )}
                    {speaker.twitterHandle && (
                      <a
                        href={`https://twitter.com/${speaker.twitterHandle.replace(
                          "@",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 -m-1"
                        title="Twitter"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                    {speaker.web && (
                      <a
                        href={speaker.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 -m-1"
                        title="Website"
                      >
                        <GlobeAltIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </a>
                    )}
                    {speaker.blog && (
                      <a
                        href={speaker.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 -m-1"
                        title="Blog"
                      >
                        <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </a>
                    )}
                  </div>
                )}

                {speaker.bio && (
                  <p className="text-xs sm:text-sm leading-relaxed line-clamp-4">
                    {speaker.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
          {Array.from({ length: announcingSoonCount }, (_, index) => (
            <div
              key={`announcing-soon-${index}`}
              className="space-y-3 sm:space-y-4"
            >
              <AnnouncingSoonTile />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
