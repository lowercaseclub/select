import Image from "next/image";
import { UsersIcon } from "@heroicons/react/24/outline";
import { getSpeakers } from "../lib/bizzabo";

export async function SpeakersSection() {
  const speakers = await getSpeakers();

  return (
    <section className="px-8 py-24">
      <div className="mb-16">
        <h2 className="text-3xl font-medium mb-4">Featured Speakers</h2>
        <p className="text-lg text-muted-foreground">
          Learn from industry leaders and successful founders who are shaping
          the future of technology.
        </p>
      </div>

      {speakers.length === 0 ? (
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
          {speakers.map((speaker) => (
            <div key={speaker.id} className="space-y-4">
              <div className="aspect-square bg-muted border border-column-lines relative">
                {speaker.profilePicture && (
                  <Image
                    src={speaker.profilePicture}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-xl font-medium">{speaker.name}</h3>
                {speaker.title && (
                  <p className="text-accent-1-foreground">{speaker.title}</p>
                )}
                {speaker.company && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {speaker.company}
                  </p>
                )}
                {speaker.bio && (
                  <p className="text-sm leading-relaxed">{speaker.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
