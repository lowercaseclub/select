// server side interface to bizzabo api

import {
  BizzaboConfig,
  BizzaboEvent,
  BizzaboSpeaker,
  BizzaboSession,
  BizzaboStage,
  BizzaboApiResponse,
} from "@/types/bizzabo";

export class BizzaboApiClient {
  private baseUrl = "https://api.bizzabo.com/v1";
  private authUrl = "https://auth.bizzabo.com";
  private accessToken: string | null = null;
  private apiKey: string | null = null;
  private clientId: string;
  private clientSecret: string;
  private accountId: string;

  constructor(config: BizzaboConfig) {
    this.clientId = process.env.BIZZABO_CLIENT_ID || "";
    this.clientSecret = process.env.BIZZABO_CLIENT_SECRET || "";
    this.accountId = process.env.BIZZABO_ACCOUNT_ID || "";
    this.apiKey = process.env.BIZZABO_API_KEY || null;
  }

  private async authenticate(): Promise<void> {
    if (this.accessToken) return;

    // Try OAuth 2.0 client credentials first (as per Bizzabo documentation)
    const response = await fetch(`${this.authUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: "https://api.bizzabo.com/api",
        grant_type: "client_credentials",
        account_id: parseInt(this.accountId),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Fall back to API key if OAuth fails
      if (this.apiKey) {
        this.accessToken = this.apiKey;
        return;
      }

      throw new Error(
        `Bizzabo authentication failed: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    this.accessToken = data.access_token;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    await this.authenticate();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Use API key in Authorization header if it's an API key, otherwise use Bearer token
    if (this.apiKey && this.accessToken === this.apiKey) {
      // Try different API key formats
      if (this.accessToken.includes(".")) {
        // If it looks like a JWT, use Bearer
        headers.Authorization = `Bearer ${this.accessToken}`;
      } else {
        // If it's a plain API key, try different header formats
        headers.Authorization = this.accessToken;
        headers["X-API-Key"] = this.accessToken;
        headers["X-Bizzabo-API-Key"] = this.accessToken;
      }
    } else {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Bizzabo API request failed: ${response.status} - ${errorText}`
      );
    }

    return response.json();
  }

  async getEvent(): Promise<BizzaboEvent> {
    const eventId = process.env.BIZZABO_EVENT_ID;
    if (!eventId) {
      throw new Error("BIZZABO_EVENT_ID is required to fetch event details.");
    }
    const response = await this.makeRequest<BizzaboApiResponse<BizzaboEvent>>(
      `/events/${eventId}`
    );
    return response.data;
  }

  async getSpeakers(): Promise<BizzaboSpeaker[]> {
    const eventId = process.env.BIZZABO_EVENT_ID;
    if (!eventId) {
      throw new Error("BIZZABO_EVENT_ID is required to fetch speakers.");
    }
    const response = await this.makeRequest<any>(`/events/${eventId}/speakers`);
    // The response structure is different - it has content array or empty array
    return response.content || [];
  }

  async getSessions(): Promise<any> {
    const eventId = process.env.BIZZABO_EVENT_ID;
    if (!eventId) {
      throw new Error("BIZZABO_EVENT_ID is required to fetch sessions.");
    }
    const response = await this.makeRequest<any>(
      `/events/${eventId}/agenda/sessions`
    );
    return response.content || [];
  }

  async getStages(): Promise<BizzaboStage[]> {
    const eventId = process.env.BIZZABO_EVENT_ID;
    if (!eventId) {
      throw new Error("BIZZABO_EVENT_ID is required to fetch stages.");
    }
    const response = await this.makeRequest<BizzaboApiResponse<BizzaboStage[]>>(
      `/events/${eventId}/stages`
    );
    return response.data;
  }

  async getEvents(): Promise<any> {
    const response = await this.makeRequest<any>(`/events`);
    return response;
  }

  // Helper method to get all event data at once
  async getAllEventData(): Promise<{
    event: BizzaboEvent;
    speakers: BizzaboSpeaker[];
    sessions: BizzaboSession[];
    stages: BizzaboStage[];
  }> {
    const [event, speakers, sessions, stages] = await Promise.all([
      this.getEvent(),
      this.getSpeakers(),
      this.getSessions(),
      this.getStages(),
    ]);

    return { event, speakers, sessions, stages };
  }
}

// Create a singleton instance
let bizzaboClient: BizzaboApiClient | null = null;

export function getBizzaboClient(): BizzaboApiClient {
  if (!bizzaboClient) {
    const clientId = process.env.BIZZABO_CLIENT_ID;
    const clientSecret = process.env.BIZZABO_CLIENT_SECRET;
    const accountId = process.env.BIZZABO_ACCOUNT_ID;
    const apiKey = process.env.BIZZABO_API_KEY;

    if (!clientId || !clientSecret || !accountId) {
      throw new Error(
        "Bizzabo API configuration is missing. Please set BIZZABO_CLIENT_ID, BIZZABO_CLIENT_SECRET, and BIZZABO_ACCOUNT_ID environment variables."
      );
    }

    bizzaboClient = new BizzaboApiClient({} as BizzaboConfig);
  }

  return bizzaboClient;
}
