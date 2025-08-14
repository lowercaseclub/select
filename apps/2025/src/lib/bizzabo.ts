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

export interface BizzaboApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
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
