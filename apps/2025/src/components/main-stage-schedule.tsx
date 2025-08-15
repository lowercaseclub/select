import { getSessions, getSpeakers } from "../lib/bizzabo-api";
import {
  transformSessionToEvent,
  sortEventsByTime,
} from "../lib/bizzabo-transformers";
import { ScheduleEventRow } from "./schedule-event-row";
import { LocationHoverCard } from "./location-hover-card";

export async function MainStageSchedule() {
  try {
    const [sessions, speakers] = await Promise.all([
      getSessions(),
      getSpeakers(),
    ]);

    // Debug: Main Stage sessions loaded

    const events = sortEventsByTime(
      sessions.map((session) => transformSessionToEvent(session, speakers))
    ).filter((event) => event.stage === "main-stage" || event.stage === "main");

    // console.log("Main Stage - Filtered events:", events);

    if (events.length === 0) {
      return (
        <p className="text-muted-foreground text-center py-8">
          No events scheduled for Main Stage yet.
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
                locationName="Union Iron Works"
                address="5 Pier 70 Blvd, San Francisco, CA 94107"
                mapUrl="https://maps.google.com/maps?q=Union%20Iron%20Works,%205%20Pier%2070%20Blvd,%20San%20Francisco,%20CA%2094107&t=&z=17&ie=UTF8&iwloc=&output=embed"
              >
                Union Iron Works
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
          Unable to load Main Stage schedule.
        </p>
      </div>
    );
  }
}
