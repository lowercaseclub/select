import { NextRequest, NextResponse } from "next/server";
import { getBizzaboClient } from "@/lib/bizzabo-api";

export async function GET(request: NextRequest) {
  try {
    const client = getBizzaboClient();
    const response = await client.getEvents();

    // The response contains events in a 'content' array
    const events = response.content || response;

    // Transform events to a simpler format for the frontend
    const transformedEvents = events.map((event: any) => ({
      id: event.id,
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      timezone: event.timezone,
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error("Error fetching events from Bizzabo:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
