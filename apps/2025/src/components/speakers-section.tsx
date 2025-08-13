"use client";

import { useEffect, useState } from "react";
import { fetchSpeakers, Speaker } from "../lib/data-fetcher";

export function SpeakersSection() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpeakers() {
      try {
        setIsLoading(true);
        const speakersData = await fetchSpeakers();
        setSpeakers(speakersData);
      } catch (err) {
        setError('Failed to load speakers');
        console.error('Error loading speakers:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSpeakers();
  }, []);

  if (isLoading) {
    return (
      <section className="px-8 py-24">
        <div className="mb-16">
          <h2 className="text-3xl font-medium mb-4">Featured Speakers</h2>
          <p className="text-lg text-muted-foreground">
            Learn from industry leaders and successful founders who are shaping
            the future of technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-4 animate-pulse">
              <div className="aspect-square bg-muted border border-column-lines"></div>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-8 py-24">
        <div className="mb-16">
          <h2 className="text-3xl font-medium mb-4">Featured Speakers</h2>
          <p className="text-lg text-muted-foreground">
            Learn from industry leaders and successful founders who are shaping
            the future of technology.
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Unable to load speakers at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-24">
      <div className="mb-16">
        <h2 className="text-3xl font-medium mb-4">Featured Speakers</h2>
        <p className="text-lg text-muted-foreground">
          Learn from industry leaders and successful founders who are shaping
          the future of technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {speakers.map((speaker) => (
          <div key={speaker.id} className="space-y-4">
            <div className="aspect-square bg-muted border border-column-lines overflow-hidden">
              {speaker.imageUrl && (
                <img 
                  src={speaker.imageUrl} 
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="text-xl font-medium">{speaker.name}</h3>
              <p className="text-accent-1-foreground">{speaker.title}</p>
              <p className="text-sm text-muted-foreground mb-3">
                {speaker.company}
              </p>
              <p className="text-sm leading-relaxed">{speaker.bio}</p>
              {speaker.socialLinks && (
                <div className="flex gap-2 mt-3">
                  {speaker.socialLinks.linkedin && (
                    <a 
                      href={speaker.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {speaker.socialLinks.twitter && (
                    <a 
                      href={speaker.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {speaker.socialLinks.website && (
                    <a 
                      href={speaker.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
