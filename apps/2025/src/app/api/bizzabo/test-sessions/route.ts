import { NextRequest, NextResponse } from "next/server";
import { getBizzaboClient } from "@/lib/bizzabo-api";

export async function GET(request: NextRequest) {
  try {
    const client = getBizzaboClient();

    console.log("Testing sessions API...");
    const sessions = await client.getSessions();
    console.log("Sessions response:", sessions);

    return NextResponse.json({
      success: true,
      sessionCount: sessions.length,
      sessions: sessions.slice(0, 2), // Return first 2 sessions for debugging
    });
  } catch (error) {
    console.error("Sessions API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
