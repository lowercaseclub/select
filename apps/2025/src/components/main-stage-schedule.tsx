import { getSessions, getSpeakers } from "../lib/bizzabo-api";
import { getEventsByStage } from "../lib/schedule-utils";
import { ScheduleEventRow } from "./schedule-event-row";
import { ScheduleError } from "./schedule-error";
import { ScheduleEmpty } from "./schedule-empty";

export async function MainStageSchedule() {
  try {
    const [sessions, speakers] = await Promise.all([
      getSessions(),
      getSpeakers(),
    ]);

    // Debug: Main Stage sessions loaded

    const events = getEventsByStage(sessions, speakers, ["main-stage", "main"]);
    // console.log("MAIN STAGE - Total events found:", events.length);
    // console.log(
    //   "MAIN STAGE - Events:",
    //   events.map((e) => ({ title: e.title, stage: e.stage }))
    // );

    // console.log("Main Stage - Filtered events:", events);

    if (events.length === 0) {
      return <ScheduleEmpty stageName="Main Stage" />;
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
  } catch (error) {
    // Error handled gracefully - fallback schedule will be shown
    console.error("MAIN STAGE ERROR:", error);
    return <ScheduleError stageName="Main Stage" />;
  }
}
