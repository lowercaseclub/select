import { NextRequest, NextResponse } from "next/server";
import { generateCSRFToken } from "@/lib/csrf";
import { allowedOrigins } from "@/lib/allowed-origins";

export async function GET(request: NextRequest) {
  try {
    // Validate origin for CSRF token requests
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    if (!origin && !referer) {
      return NextResponse.json({ error: "Invalid request" }, { status: 403 });
    }

    // Use shared allowed origins configuration

    console.log("Allowed origins:", allowedOrigins);
    console.log("Request origin:", origin);
    console.log("Request referer:", referer);

    // Debug logging for development
    if (process.env.NODE_ENV === "development") {
      console.log("Origin check debug:", {
        origin,
        referer,
        allowedOrigins,
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

        // Also check if the referer (with trailing slash) matches any allowed origin
        if (!isValidOrigin) {
          isValidOrigin = allowedOrigins.some((origin) =>
            referer.startsWith(origin)
          );
        }

        // Check for Vercel deployment pattern: select-*-supabase.vercel.app
        if (!isValidOrigin && refererOrigin.includes(".vercel.app")) {
          const isVercelPattern =
            /^https?:\/\/select-.*-supabase\.vercel\.app$/.test(refererOrigin);
          if (isVercelPattern) {
            console.log("Allowing Vercel deployment pattern:", refererOrigin);
            isValidOrigin = true;
          }
        }
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
