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
  const allEvents = sessions.map((session) =>
    transformSessionToEvent(session, speakers)
  );

  return sortEventsByTime(
    allEvents.filter((event) => {
      // Include lunch and party sessions on all stages
      const isLunchOrParty =
        event.title.toLowerCase().includes("lunch") ||
        event.title.toLowerCase().includes("party");

      return stageIds.includes(event.stage) || isLunchOrParty;
    })
  );
}
