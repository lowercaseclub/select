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
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      process.env.VERCEL_URL ||
      "select-2025.vercel.app";

    // Handle different URL formats
    let allowedOrigins: string[] = [];

    if (allowedHost) {
      // If it's already a full URL, use it as-is
      if (allowedHost.startsWith("http")) {
        allowedOrigins = [
          allowedHost,
          allowedHost.replace("https://", "http://"),
          allowedHost.replace("http://", "https://"),
        ];
      } else {
        // If it's just a hostname, add protocols
        allowedOrigins = [
          `https://${allowedHost}`,
          `http://${allowedHost}`,
          `https://www.${allowedHost}`,
          `http://www.${allowedHost}`,
        ];
      }
    }

    // Add select.supabase.com specifically for production
    allowedOrigins.push(
      "https://select.supabase.com",
      "http://select.supabase.com"
    );

    console.log("Allowed origins:", allowedOrigins);
    console.log("Request origin:", origin);
    console.log("Request referer:", referer);

    // Debug logging for development
    if (process.env.NODE_ENV === "development") {
      console.log("Origin check debug:", {
        origin,
        referer,
        allowedHost,
        allowedOrigins,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        VERCEL_URL: process.env.VERCEL_URL,
        NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
        NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
          process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
      });
    }

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
      console.log("CSRF Origin validation failed:", {
        origin,
        referer,
        allowedOrigins,
      });
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
