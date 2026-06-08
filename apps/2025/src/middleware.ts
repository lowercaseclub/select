import { NextRequest, NextResponse } from "next/server";
import { isValidOrigin } from "@/lib/origin-validation";

// The 2025 event has ended. Every public route is rerouted to this private,
// noindex holding page in deployed environments (see middleware below).
const HOLDING_ROUTE = "/closed";

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 5 requests per minute per IP

function getClientIP(request: NextRequest): string {
  // Get IP from various headers (for different deployment scenarios)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to connection remote address
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Use shared validation logic without logging (middleware should be quiet)
  return isValidOrigin(origin, referer, false);
}

export function middleware(request: NextRequest) {
  // 2025 is archived: reroute every public request to the private holding page
  // in any deployed environment. `next dev` is exempt so the real content stays
  // viewable locally for reference (the matcher already excludes /closed and
  // static assets, so this never loops or hides the holding page itself).
  if (process.env.NODE_ENV !== "development") {
    const url = request.nextUrl.clone();
    url.pathname = HOLDING_ROUTE;
    return NextResponse.redirect(url, 307);
  }

  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Skip middleware for certain API routes that might need different handling
  const skipRateLimit =
    request.nextUrl.pathname.startsWith("/api/bizzabo/") ||
    request.nextUrl.pathname.startsWith("/api/supatone");

  if (!skipRateLimit) {
    const clientIP = getClientIP(request);

    // Rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Origin validation for sensitive endpoints
    if (request.nextUrl.pathname === "/api/apply") {
      if (!validateOrigin(request)) {
        return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
      }
    }
  }

  // Add security headers
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  return response;
}

export const config = {
  // Run on every route so the archive redirect can catch page + API requests,
  // while excluding Next internals, the holding page itself, the OG/Twitter
  // image routes, and any path with a file extension (static assets).
  matcher: ["/((?!_next/|closed|opengraph-image|twitter-image|.*\\.).*)"],
};
