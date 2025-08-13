// server side interface to our Customer.io API

interface CustomerioProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

interface CustomerioEvent {
  userId: string;
  type: "track";
  event: string;
  properties: Record<string, any>;
  timestamp: number;
}

export class CustomerioClient {
  private baseUrl = "https://track.customer.io/api/v1";
  private auth: string;

  constructor(private siteId: string, private apiKey: string) {
    this.auth = btoa(`${siteId}:${apiKey}`);
  }

  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Basic ${this.auth}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Customer.io API request failed: ${response.status} - ${errorText}`
      );
      console.error(`Request URL: ${this.baseUrl}${endpoint}`);
      console.error(`Request method: ${method}`);
      throw new Error(
        `Customer.io API request failed: ${response.status} - ${errorText}`
      );
    }

    if (response.headers.get("content-type")?.includes("application/json")) {
      return response.json();
    }

    return {} as T;
  }

  async createOrUpdateProfile(
    email: string,
    attributes: Partial<CustomerioProfile> = {}
  ): Promise<void> {
    const profile = {
      email,
      ...attributes,
    };

    await this.makeRequest(
      `/customers/${encodeURIComponent(email)}`,
      "PUT",
      profile
    );
  }

  async trackEvent(email: string, event: CustomerioEvent): Promise<void> {
    const { userId, ...eventPayload } = event;

    const trackEventPayload = {
      name: eventPayload.event,
      data: eventPayload.properties,
      timestamp: eventPayload.timestamp,
    };

    await this.makeRequest(
      `/customers/${encodeURIComponent(email)}/events`,
      "POST",
      trackEventPayload
    );
  }

  isoToUnixTimestamp(isoString: string): number {
    return Math.floor(new Date(isoString).getTime() / 1000);
  }
}
