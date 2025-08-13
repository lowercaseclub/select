import { NextRequest, NextResponse } from "next/server";
import { getBizzaboClient } from "@/lib/bizzabo-api";

export async function GET(request: NextRequest) {
  try {
    const client = getBizzaboClient();
    const sessions = await client.getSessions();

    return NextResponse.json({
      success: true,
      sessionCount: sessions.length,
      sessions: sessions,
    });
  } catch (error) {
    console.error("Raw sessions API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
