import { BizzaboSession, BizzaboSpeaker } from "../types/bizzabo.types";
import {
  transformSessionToEvent,
  sortEventsByTime,
} from "./bizzabo-transformers";

export function getEventsByStage(
  sessions: BizzaboSession[],
  speakers: BizzaboSpeaker[],
  stageIds: string[]
) {
  const allEvents = sessions.map((session) => transformSessionToEvent(session));

  console.log("FILTERING - Looking for stages:", stageIds);
  console.log(
    "FILTERING - All events with stages:",
    allEvents.map((e) => ({ title: e.title, stage: e.stage }))
  );

  const filtered = allEvents.filter((event) => {
    // Include lunch and party sessions on all stages
    const isLunchOrParty =
      event.title.toLowerCase().includes("lunch") ||
      event.title.toLowerCase().includes("party");

    const matches = stageIds.includes(event.stage) || isLunchOrParty;
    console.log(
      `FILTERING - Event "${event.title}" (stage: ${event.stage}) matches: ${matches}`
    );
    return matches;
  });

  console.log("FILTERING - Final filtered events:", filtered.length);
  return sortEventsByTime(filtered);
}
