import { NextRequest, NextResponse } from "next/server";
import { generateCSRFToken } from "@/lib/csrf";

export async function GET(request: NextRequest) {
  try {
    // Validate origin for CSRF token requests
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    if (!origin && !referer) {
      return NextResponse.json({ error: "Invalid request" }, { status: 403 });
    }

    // Get the host from environment or default
    const allowedHost =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL ||
      "localhost:3000";

    const allowedOrigins = [
      `https://${allowedHost}`,
      `http://${allowedHost}`,
      `https://www.${allowedHost}`,
      `http://www.${allowedHost}`,
    ];

    let isValidOrigin = false;

    if (origin && allowedOrigins.includes(origin)) {
      isValidOrigin = true;
    }

    if (referer && !isValidOrigin) {
      try {
        const refererUrl = new URL(referer);
        const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
        isValidOrigin = allowedOrigins.includes(refererOrigin);
      } catch {
        // Invalid referer URL
      }
    }

    if (!isValidOrigin) {
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
