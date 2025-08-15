import { NextRequest, NextResponse } from "next/server";
import { generateCSRFToken } from "@/lib/csrf";
import { isValidOrigin } from "@/lib/origin-validation";

export async function GET(request: NextRequest) {
  try {
    // Validate origin for CSRF token requests
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    if (!origin && !referer) {
      return NextResponse.json({ error: "Invalid request" }, { status: 403 });
    }

    // Validate origin using shared validation logic
    const enableLogging = true; // Always log for CSRF endpoint
    if (!isValidOrigin(origin, referer, enableLogging)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    const csrfToken = generateCSRFToken();

    return NextResponse.json({
      token: csrfToken.token,
      expiresAt: csrfToken.expiresAt,
    });
  } catch (error) {
    console.error("Error generating CSRF token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
