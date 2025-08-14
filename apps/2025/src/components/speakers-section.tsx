import Image from "next/image";
import { UsersIcon } from "@heroicons/react/24/outline";
import { LinkIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { getSpeakers } from "../lib/bizzabo-api";
import { BizzaboSpeaker } from "../types/bizzabo.types";

export async function SpeakersSection() {
  let speakers: BizzaboSpeaker[] = [];

  try {
    speakers = await getSpeakers();
    console.log("Speakers data:", JSON.stringify(speakers, null, 2));
  } catch (error) {
    console.error("Error fetching speakers from Bizzabo:", error);
    speakers = [];
  }

  // Add placeholder "Announcing Soon" tiles based on env var
  const announcingSoonCount = parseInt(
    process.env.ANNOUNCING_SOON_SPEAKERS || "0",
    10
  );
  const announcingSoonTiles = Array.from(
    { length: announcingSoonCount },
    (_, index) => ({
      id: `announcing-soon-${index}`,
      isAnnouncingSoon: true,
    })
  );

  const allItems = [...speakers, ...announcingSoonTiles];

  return (
    <section className="px-8 py-24">
      <div className="mb-16">
        <h2 className="text-3xl font-medium mb-4">Featured Speakers</h2>
        <p className="text-lg text-muted-foreground">
          Learn from industry leaders and successful founders who are shaping
          the future of technology.
        </p>
      </div>

      {allItems.length === 0 ||
      (speakers.length === 0 && announcingSoonCount === 0) ||
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allItems.map((item: any) => (
            <div key={item.id} className="space-y-4">
              {item.isAnnouncingSoon ? (
                // "Announcing Soon" tile
                <>
                  <div className="aspect-square bg-muted border border-column-lines relative flex items-center justify-center overflow-hidden">
                    {/* 1px X pattern */}
                    <svg
                      className="absolute inset-0 w-full h-full opacity-20"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="100"
                        y2="100"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                      <line
                        x1="100"
                        y1="0"
                        x2="0"
                        y2="100"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    {/* Overlay text */}
                    <div className="relative z-10 text-center">
                      <div className="bg-black/50 px-3 py-1 rounded text-white text-xs font-medium tracking-wider">
                        ANNOUNCEMENT SOON
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-muted-foreground">
                      Speaker TBA
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      More speakers to be announced soon
                    </p>
                  </div>
                </>
              ) : (
                // Regular speaker tile
                <>
                  <div className="aspect-square bg-muted border border-column-lines relative">
                    {item.photoSet?.large && (
                      <Image
                        src={item.photoSet.large}
                        alt={`${item.firstname} ${item.lastname}`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">
                      {item.prefix && `${item.prefix} `}
                      {item.firstname} {item.lastname}
                    </h3>
                    {item.title && (
                      <p className="text-accent-1-foreground">{item.title}</p>
                    )}
                    {item.company && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.company}
                      </p>
                    )}
                    {item.country && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {item.country}
                      </p>
                    )}

                    {/* Social Links */}
                    {(item.linkedIn ||
                      item.twitterHandle ||
                      item.web ||
                      item.blog) && (
                      <div className="flex gap-2 mb-3">
                        {item.linkedIn && (
                          <a
                            href={item.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="LinkedIn"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        )}
                        {item.twitterHandle && (
                          <a
                            href={`https://twitter.com/${item.twitterHandle.replace(
                              "@",
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Twitter"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                        )}
                        {item.web && (
                          <a
                            href={item.web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Website"
                          >
                            <GlobeAltIcon className="w-4 h-4" />
                          </a>
                        )}
                        {item.blog && (
                          <a
                            href={item.blog}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Blog"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}

                    {item.bio && (
                      <p className="text-sm leading-relaxed">{item.bio}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
