import { getSessions, getSpeakers } from "../lib/bizzabo-api";
import {
  transformSessionToEvent,
  sortEventsByTime,
} from "../lib/bizzabo-transformers";
import { ScheduleEventRow } from "./schedule-event-row";
import { LocationHoverCard } from "./location-hover-card";

export async function BuildStageSchedule() {
  try {
    const [sessions, speakers] = await Promise.all([
      getSessions(),
      getSpeakers(),
    ]);

    // console.log("Build Stage - Raw sessions:", sessions);

    const events = sortEventsByTime(
      sessions.map((session) => transformSessionToEvent(session, speakers))
    ).filter(
      (event) => event.stage === "build-stage" || event.stage === "build"
    );

    // console.log("Build Stage - Filtered events:", events);

    if (events.length === 0) {
      return (
        <p className="text-muted-foreground text-center py-8">
          No events scheduled for Build Stage yet.
        </p>
      );
    }

    return (
      <div className="space-y-0">
        {/* Mobile location info - only show on mobile */}
        <div className="md:hidden py-4 border-b border-column-lines">
          <div className="max-w-site mx-auto px-8">
            <div className="text-sm text-muted-foreground">
              @{" "}
              <LocationHoverCard
                locationName="Y Combinator"
                address="580 20th St, San Francisco, CA 94107"
                mapUrl="https://maps.google.com/maps?q=580%2020th%20Street,%20San%20Francisco,%20CA%2094107&t=&z=17&ie=UTF8&iwloc=&output=embed"
              >
                520 YC
              </LocationHoverCard>
            </div>
          </div>
        </div>

        {/* Desktop header - only show on desktop */}
        <div className="hidden md:block py-4 border-b border-column-lines text-muted-foreground text-sm font-medium">
          <div className="max-w-site mx-auto px-8 grid grid-cols-12 gap-4">
            <div className="col-span-3">TIME</div>
            <div className="col-span-5">TITLE</div>
            <div className="col-span-4">SPEAKERS</div>
          </div>
        </div>

        {/* Events */}
        {events.map((event, index) => (
          <ScheduleEventRow
            key={`${event.title}-${event.time}-${index}`}
            event={event}
            index={index}
          />
        ))}
      </div>
    );
  } catch {
    // Error handled gracefully - fallback schedule will be shown
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Unable to load Build Stage schedule.
        </p>
      </div>
    );
  }
}
