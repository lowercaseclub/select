// client side interface to our Next.js API

import speakersData from "@/data/speakers.json";
import scheduleData from "@/data/schedule.json";

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  imageUrl?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  speakers: string;
  stage: string;
  description?: string;
  sessionType?: string;
}

export interface Stage {
  name: string;
  location: string;
  active: boolean;
}

export interface ScheduleData {
  stages: Stage[];
  events: ScheduleEvent[];
}

export async function fetchSpeakers(): Promise<Speaker[]> {
  try {
    // Try to fetch from Bizzabo API first
    const response = await fetch("/api/bizzabo/speakers");
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn(
      "Failed to fetch speakers from Bizzabo API, using local data:",
      error
    );
  }

  // Fallback to local data
  return speakersData.map((speaker, index) => ({
    id: `local-${index}`,
    name: speaker.name,
    title: speaker.title,
    company: speaker.company,
    bio: speaker.bio,
  }));
}

export async function fetchSchedule(): Promise<ScheduleData> {
  try {
    // Try to fetch from Bizzabo API first
    const response = await fetch("/api/bizzabo/schedule");
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn(
      "Failed to fetch schedule from Bizzabo API, using local data:",
      error
    );
  }

  // Fallback to local data with proper typing
  return {
    stages: scheduleData.stages,
    events: scheduleData.events.map((event, index) => ({
      id: `local-${index}`,
      time: event.time,
      title: event.title,
      speakers: event.speakers,
      stage: event.stage,
    })),
  };
}

// Utility function to check if Bizzabo API is available
export async function isBizzaboApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch("/api/bizzabo/speakers");
    return response.ok;
  } catch {
    return false;
  }
}
