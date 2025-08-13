// Client-side data fetching and display types
//
// Architecture:
// 1. This file provides client-side functions that fetch data from our Next.js API routes
// 2. The API routes transform raw Bizzabo API data into these display-ready types
// 3. React components use these types for rendering
//
// Data Flow: Bizzabo API → Next.js API Routes → Client (this file) → React Components
//
// These types represent the final, display-ready data structure for React components

import speakersData from "@/data/speakers.json";
import scheduleData from "@/data/schedule.json";

export interface DisplaySpeaker {
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

export interface DisplayScheduleEvent {
  id: string;
  time: string;
  title: string;
  speakers: string;
  stage: string;
  description?: string;
  sessionType?: string;
}

export interface DisplayStage {
  name: string;
  location: string;
  active: boolean;
}

export interface DisplayScheduleData {
  stages: DisplayStage[];
  events: DisplayScheduleEvent[];
}

export async function fetchSpeakers(): Promise<DisplaySpeaker[]> {
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

export async function fetchSchedule(): Promise<DisplayScheduleData> {
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
