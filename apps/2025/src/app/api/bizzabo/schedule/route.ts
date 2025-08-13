import { NextRequest, NextResponse } from "next/server";
import { getBizzaboClient } from "@/lib/bizzabo-api";
import {
  FALLBACK_SESSIONS,
  FALLBACK_STAGES,
  FALLBACK_SPEAKERS,
  BIZZABO_LOCATIONS,
} from "@/types/fallback-data";

export async function GET(request: NextRequest) {
  try {
    const client = getBizzaboClient();

    // Try to fetch sessions and speakers from Bizzabo
    let sessions: any[] = [];
    let speakers: any[] = [];

    try {
      const [sessionsResponse, speakersResponse] = await Promise.all([
        client.getSessions(),
        client.getSpeakers(),
      ]);

      sessions = sessionsResponse || [];
      speakers = speakersResponse || [];
      console.log(
        `Successfully fetched ${sessions.length} sessions and ${speakers.length} speakers from Bizzabo`
      );
    } catch (error) {
      console.log(
        "Failed to fetch data from Bizzabo, using fallback data:",
        error
      );
      sessions = FALLBACK_SESSIONS;
      speakers = FALLBACK_SPEAKERS;
    }

    // Always use fallback stages since we don't fetch them from Bizzabo
    const stages = FALLBACK_STAGES;

    console.log(`Processing ${sessions.length} sessions for transformation`);
    console.log(`Sessions array:`, sessions.slice(0, 2)); // Log first 2 sessions

    // Transform Bizzabo sessions to match our component's expected format
    const transformedEvents = sessions
      // .filter((session) => !session.hidden) // Temporarily disabled filter
      .map((session) => {
        // Get speaker names by looking up speaker IDs from the speakers array
        const speakerNames =
          session.speakers
            ?.map((speakerObj: any) => {
              const speaker = speakers.find(
                (s: any) => s.id === speakerObj.speakerId
              );
              return speaker ? `${speaker.firstname} ${speaker.lastname}` : "";
            })
            .filter(Boolean)
            .join(", ") || "";

        // Convert start/end times from date + minute format
        let timeString = "10:00 AM - 11:00 AM"; // Default fallback

        if (
          session.startDate &&
          session.startMinute !== undefined &&
          session.endMinute !== undefined
        ) {
          try {
            const startHour = Math.floor(session.startMinute / 60);
            const startMinute = session.startMinute % 60;
            const endHour = Math.floor(session.endMinute / 60);
            const endMinute = session.endMinute % 60;

            const startTimeStr = `${startHour
              .toString()
              .padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
            const endTimeStr = `${endHour
              .toString()
              .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

            timeString = `${startTimeStr} - ${endTimeStr}`;
          } catch (error) {
            console.log(
              `Error converting time for session ${session.title}:`,
              error
            );
          }
        }

        // Map locationId to stage name
        const location = BIZZABO_LOCATIONS.find(
          (loc) => loc.id === session.locationId
        );
        const stageName = location ? location.nameId : "main-stage";

        console.log(
          `Session ${session.title}: timeString="${timeString}", title="${session.title}"`
        );

        return {
          id: session.id,
          time: timeString,
          title: session.title?.toUpperCase() || "",
          speakers: speakerNames,
          stage: stageName,
          description: session.description || "",
          sessionType: "session",
        };
      })
      .sort((a, b) => {
        // Sort by start time (first part of time string)
        const timeA = a.time.split(" - ")[0];
        const timeB = b.time.split(" - ")[0];

        // Convert HH:MM to minutes for comparison
        const getMinutes = (timeStr: string) => {
          const [hours, minutes] = timeStr.split(":").map(Number);
          return hours * 60 + minutes;
        };

        return getMinutes(timeA) - getMinutes(timeB);
      });

    console.log(`Transformed ${transformedEvents.length} events`);

    // Transform stages to match our component's expected format
    const transformedStages = stages.map((stage) => ({
      name: stage.name,
      location: stage.location || "",
      active: stage.isActive,
    }));

    const scheduleData = {
      stages: transformedStages,
      events: transformedEvents,
    };

    return NextResponse.json(scheduleData);
  } catch (error) {
    console.error("Error fetching schedule from Bizzabo:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
