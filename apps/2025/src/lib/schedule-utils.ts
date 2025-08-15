import { BizzaboSession, BizzaboSpeaker } from "../types/bizzabo.types";
import { transformSessionToEvent, sortEventsByTime } from "./bizzabo-transformers";

export function getEventsByStage(
  sessions: BizzaboSession[],
  speakers: BizzaboSpeaker[],
  stageIds: string[]
) {
  return sortEventsByTime(
    sessions.map((session) => transformSessionToEvent(session, speakers))
  ).filter((event) => stageIds.includes(event.stage));
}
