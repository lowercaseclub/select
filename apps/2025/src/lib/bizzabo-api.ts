// server side interface to bizzabo api

import {
  BizzaboEvent,
  BizzaboSpeaker,
  BizzaboSession,
  BizzaboStage,
  BizzaboApiResponse,
  BizzaboContact,
  BizzaboContactResponse,
} from "@/types/bizzabo.types";
// import scheduleData from "@/data/schedule.json"; // Available for future use

const baseUrl = "https://api.bizzabo.com/v1";
const authUrl = "https://auth.bizzabo.com";

let accessToken: string | null = null;

async function authenticate(): Promise<void> {
  if (accessToken) return;

  const clientId = process.env.BIZZABO_CLIENT_ID;
  const clientSecret = process.env.BIZZABO_CLIENT_SECRET;
  const accountId = process.env.BIZZABO_ACCOUNT_ID;
  const apiKey = process.env.BIZZABO_API_KEY;

  console.log("Bizzabo Authentication Debug:", {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasAccountId: !!accountId,
    hasApiKey: !!apiKey,
    accountId: accountId,
  });

  // Try OAuth 2.0 client credentials first
  if (clientId && clientSecret && accountId) {
    console.log("Attempting OAuth 2.0 authentication...");
    const response = await fetch(`${authUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: "https://api.bizzabo.com/api",
        grant_type: "client_credentials",
        account_id: parseInt(accountId),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      accessToken = data.access_token;
      console.log("OAuth 2.0 authentication successful");
      return;
    } else {
      console.error(
        "OAuth 2.0 authentication failed:",
        response.status,
        await response.text()
      );
    }
  }

  // Fall back to API key
  if (apiKey) {
    accessToken = apiKey;
    console.log("Using API key authentication");
    return;
  }

  throw new Error("Bizzabo authentication failed - no valid credentials");
}

async function makeRequest<T>(endpoint: string): Promise<T> {
  await authenticate();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const apiKey = process.env.BIZZABO_API_KEY;
  if (apiKey && accessToken === apiKey) {
    if (accessToken.includes(".")) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      headers.Authorization = accessToken;
      headers["X-API-Key"] = accessToken;
      headers["X-Bizzabo-API-Key"] = accessToken;
    }
  } else {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, { headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Bizzabo API request failed: ${response.status} - ${errorText}`
    );
  }

  return response.json();
}

async function makePostRequest<T>(endpoint: string, body: any): Promise<T> {
  await authenticate();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const apiKey = process.env.BIZZABO_API_KEY;
  if (apiKey && accessToken === apiKey) {
    if (accessToken.includes(".")) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      headers.Authorization = accessToken;
      headers["X-API-Key"] = accessToken;
      headers["X-Bizzabo-API-Key"] = accessToken;
    }
  } else {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  console.log("Bizzabo API Request:", {
    endpoint: `${baseUrl}${endpoint}`,
    method: "POST",
    headers: { ...headers, Authorization: "[REDACTED]" },
    body: body,
    bodyStringified: JSON.stringify(body),
  });

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Bizzabo API Error Details:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      errorText: errorText,
      requestBody: body,
    });
    throw new Error(
      `Bizzabo API POST request failed: ${response.status} - ${errorText}`
    );
  }

  return response.json();
}

export async function getSpeakers(): Promise<BizzaboSpeaker[]> {
  const eventId = process.env.BIZZABO_EVENT_ID;
  if (!eventId) {
    // Return fallback/mock data when BIZZABO_EVENT_ID is not configured
    return [
      {
        id: 1,
        email: "speaker@example.com",
        firstname: "Speaker",
        lastname: "Name",
        title: "Role",
        company: "Company",
      },
    ];
  }
  const response = await makeRequest<{ content: BizzaboSpeaker[] }>(
    `/events/${eventId}/speakers`
  );
  return response.content || [];
}

export async function getSessions(): Promise<BizzaboSession[]> {
  const eventId = process.env.BIZZABO_EVENT_ID;
  if (!eventId) {
    // Return fallback/mock data when BIZZABO_EVENT_ID is not configured
    return [
      {
        id: "1",
        title: "Sample Session",
        description: "A sample session for fallback",
        startTime: "2025-01-01T10:00:00Z",
        endTime: "2025-01-01T11:00:00Z",
        startMinute: 600,
        endMinute: 660,
        stageId: "1",
        stageName: "main-stage",
        speakers: [],
        sessionType: "keynote",
        isPublic: true,
      },
    ];
  }
  const response = await makeRequest<{ content: BizzaboSession[] }>(
    `/events/${eventId}/agenda/sessions`
  );
  return response.content || [];
}

export async function getStages(): Promise<BizzaboStage[]> {
  const eventId = process.env.BIZZABO_EVENT_ID;
  if (!eventId) {
    // Return fallback/mock data when BIZZABO_EVENT_ID is not configured
    return [
      {
        id: "1",
        name: "Main Stage",
        location: "Main Venue",
        isActive: true,
      },
    ];
  }
  const response = await makeRequest<BizzaboApiResponse<BizzaboStage[]>>(
    `/events/${eventId}/stages`
  );
  return response.data;
}

export async function getEvent(): Promise<BizzaboEvent> {
  const eventId = process.env.BIZZABO_EVENT_ID;
  if (!eventId) {
    throw new Error("BIZZABO_EVENT_ID is required to fetch event details.");
  }
  return await makeRequest<BizzaboEvent>(`/events/${eventId}`);
}

export async function getEvents(): Promise<BizzaboEvent[]> {
  const response = await makeRequest<{ content: BizzaboEvent[] }>(`/events`);
  return response.content || [];
}

export async function getAllEventData(): Promise<{
  event: BizzaboEvent;
  speakers: BizzaboSpeaker[];
  sessions: BizzaboSession[];
  stages: BizzaboStage[];
}> {
  const [event, speakers, sessions, stages] = await Promise.all([
    getEvent(),
    getSpeakers(),
    getSessions(),
    getStages(),
  ]);

  return { event, speakers, sessions, stages };
}

export async function createContact(
  contact: BizzaboContact
): Promise<BizzaboContactResponse> {
  const eventId = process.env.BIZZABO_EVENT_ID;
  if (!eventId) {
    throw new Error("BIZZABO_EVENT_ID is required to create contacts.");
  }

  // Validate event ID is a number
  const eventIdNum = parseInt(eventId);
  if (isNaN(eventIdNum)) {
    throw new Error(`Invalid BIZZABO_EVENT_ID: ${eventId}. Must be a number.`);
  }

  console.log("Using Event ID:", eventId, "as number:", eventIdNum);

  // Validate required fields
  if (!contact.email || !contact.firstName || !contact.lastName) {
    throw new Error(
      "Email, firstName, and lastName are required for Bizzabo contacts."
    );
  }

  // Prepare the contact data according to Bizzabo API requirements
  // Start with the required fields and add company
  const contactData: any = {
    email: contact.email.trim(),
    firstName: contact.firstName.trim(),
    lastName: contact.lastName.trim(),
  };

  // Add company field
  if (contact.company && contact.company.trim()) {
    contactData.company = contact.company.trim();
  }

  // Add social links with correct Bizzabo field names
  if (contact.linkedin && contact.linkedin.trim()) {
    contactData.linkedinPage = contact.linkedin.trim();
  }
  if (contact.github && contact.github.trim()) {
    contactData.github = contact.github.trim();
  }
  if (contact.twitter && contact.twitter.trim()) {
    // Extract Twitter username from URL or use as-is if it's already a username
    const twitterUrl = contact.twitter.trim();
    const twitterUsername = twitterUrl.includes("twitter.com")
      ? twitterUrl.split("twitter.com/")[1]?.split("?")[0]?.split("/")[0]
      : twitterUrl.replace("@", "");

    if (twitterUsername) {
      contactData.twitter = twitterUsername;
    }
  }

  console.log("Creating Bizzabo contact with data:", contactData);
  console.log("Event ID:", eventId);

  // Try wrapping the data in case Bizzabo expects a specific structure
  const requestBody = {
    properties: contactData,
  };

  console.log("Final request body:", requestBody);

  return await makePostRequest<BizzaboContactResponse>(
    `/events/${eventIdNum}/contacts`,
    requestBody
  );
}
