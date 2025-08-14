// Bizzabo API integration
export interface BizzaboSpeaker {
  id: string;
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  profilePicture?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface BizzaboScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  speakers?: string[];
  stage?: string;
  sessionType?: string;
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

export interface BizzaboStage {
  id: string;
  name: string;
  location: string;
  active: boolean;
}

export interface BizzaboApiResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

async function bizzaboFetch<T>(endpoint: string): Promise<T> {
  const apiKey = process.env.BIZZABO_API_KEY;
  const eventId = process.env.BIZZABO_EVENT_ID;

  if (!apiKey || !eventId) {
    throw new Error("Bizzabo API credentials not configured");
  }

  const response = await fetch(
    `https://api.bizzabo.com/v1/events/${eventId}${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // Cache for 5 minutes in production
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Bizzabo API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getSpeakers(): Promise<BizzaboSpeaker[]> {
  try {
    const response = await bizzaboFetch<BizzaboApiResponse<BizzaboSpeaker>>(
      "/speakers"
    );
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch speakers from Bizzabo:", error);

    // In development, you might want to throw the error to see what's wrong
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Bizzabo API failed, returning empty speakers array. Check your API credentials."
      );
    }

    // Gracefully return empty array in production
    return [];
  }
}

export async function getStages(): Promise<BizzaboStage[]> {
  try {
    const response = await bizzaboFetch<BizzaboApiResponse<BizzaboStage>>(
      "/stages"
    );
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch stages from Bizzabo:", error);

    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Bizzabo API failed, returning empty stages array. Check your API credentials."
      );
    }

    // Gracefully return empty array in production
    return [];
  }
}

export async function getSchedule(): Promise<{
  stages: BizzaboStage[];
  events: DisplayScheduleEvent[];
}> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/bizzabo/schedule`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      throw new Error(`Schedule API failed: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch schedule:", error);

    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Schedule API failed, returning empty schedule. Check your API setup."
      );
    }

    // Gracefully return empty schedule
    return { stages: [], events: [] };
  }
}
