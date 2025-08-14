import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { BIZZABO_LOCATIONS } from "../types/bizzabo-locations";
import {
  BizzaboSpeaker,
  BizzaboSession,
  ScheduleEvent,
  SessionSpeakerRef,
} from "../types/bizzabo.types";

dayjs.extend(utc);
dayjs.extend(timezone);

export function convertMinutesToTimeString(
  startMinute: number,
  endMinute: number
): string {
  try {
    const startHour = Math.floor(startMinute / 60);
    const startMin = startMinute % 60;
    const endHour = Math.floor(endMinute / 60);
    const endMin = endMinute % 60;

    const startTimeStr = `${startHour.toString().padStart(2, "0")}:${startMin
      .toString()
      .padStart(2, "0")}`;
    const endTimeStr = `${endHour.toString().padStart(2, "0")}:${endMin
      .toString()
      .padStart(2, "0")}`;

    return `${startTimeStr} - ${endTimeStr}`;
  } catch (error) {
    console.error("Error converting time:", error);
    return "10:00 AM - 11:00 AM";
  }
}

export function getSpeakerNames(
  sessionSpeakers: SessionSpeakerRef[],
  allSpeakers: BizzaboSpeaker[]
): string {
  return (
    sessionSpeakers
      ?.map((speakerObj) => {
        const speaker = allSpeakers.find(
          (s) => s.id === Number(speakerObj.speakerId)
        );
        return speaker
          ? `${speaker.firstname || ""} ${speaker.lastname || ""}`.trim()
          : "";
      })
      .filter(Boolean)
      .join(", ") || ""
  );
}

export function mapLocationToStage(locationId: string): string {
  const location = BIZZABO_LOCATIONS.find(
    (loc) => loc.id === Number(locationId)
  );
  return location ? location.nameId : "main-stage";
}

export function transformSessionToEvent(
  session: BizzaboSession,
  speakers: BizzaboSpeaker[]
): ScheduleEvent {
  console.log("SESSION OBJECT:", session);

  const speakerNames = getSpeakerNames(
    (session.speakers || [])
      .filter((s) => s.id != null)
      .map((s) => ({ speakerId: s.id.toString() })),
    speakers
  );

  let timeString = "TBD";

  if (session.startMinute !== undefined && session.endMinute !== undefined) {
    console.log("FOUND MINUTES:", session.startMinute, session.endMinute);
    timeString = convertMinutesToTimeString(
      session.startMinute,
      session.endMinute
    );
  } else {
    console.log("NO MINUTES FOUND IN SESSION");
  }

  const stageName = session.stageName || "main-stage";

  return {
    id: session.id,
    time: timeString,
    title: session.title?.toUpperCase() || "",
    speakers: speakerNames,
    stage: stageName,
    description: session.description || "",
    sessionType: session.sessionType,
  };
}

export function sortEventsByTime(events: ScheduleEvent[]): ScheduleEvent[] {
  return events.sort((a, b) => {
    const timeA = a.time.split(" - ")[0];
    const timeB = b.time.split(" - ")[0];

    const getMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    return getMinutes(timeA) - getMinutes(timeB);
  });
}
