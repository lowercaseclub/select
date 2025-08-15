import { getSessions, getSpeakers } from "../lib/bizzabo-api";
import { getEventsByStage } from "../lib/schedule-utils";
import { ScheduleEventRow } from "./schedule-event-row";
import { ScheduleError } from "./schedule-error";
import { ScheduleEmpty } from "./schedule-empty";

export async function BuildStageSchedule() {
  try {
    const [sessions, speakers] = await Promise.all([
      getSessions(),
      getSpeakers(),
    ]);

    // console.log("Build Stage - Raw sessions:", sessions);

    const events = getEventsByStage(sessions, speakers, [
      "build-stage",
      "build",
    ]);

    // console.log("Build Stage - Filtered events:", events);

    if (events.length === 0) {
      return <ScheduleEmpty stageName="Build Stage" />;
    }

    return (
      <div className="space-y-0">
        {/* Events */}
        {events.map((event, index) => (
          <ScheduleEventRow
            key={`${event.title}-${event.time}-${index}`}
            event={event}
            speakers={speakers}
            index={index}
          />
        ))}
      </div>
    );
  } catch {
    // Error handled gracefully - fallback schedule will be shown
    return <ScheduleError stageName="Build Stage" />;
  }
}
