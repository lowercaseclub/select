"use client";

import speakersData from "../data/speakers.json";

export function SpeakersSection() {
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
        {speakersData.map((speaker, index) => (
          <div key={index} className="space-y-4">
            <div className="aspect-square bg-muted border border-column-lines"></div>
            <div>
              <h3 className="text-xl font-medium">{speaker.name}</h3>
              <p className="text-accent-1-foreground">{speaker.title}</p>
              <p className="text-sm text-muted-foreground mb-3">
                {speaker.company}
              </p>
              <p className="text-sm leading-relaxed">{speaker.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
