import { NextRequest } from "next/server";

/**
 * Extracts the base URL from a Next.js request object
 * Uses the Host header and protocol to construct the proper base URL
 * Falls back to environment variable if headers are not available
 */
export function getBaseUrl(request: NextRequest): string {
  // Try to get from environment variable first (for production deployments)
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (envBaseUrl) {
    return envBaseUrl;
  }

  // Extract from request headers
  const host = request.headers.get("host");
  const protocol =
    request.headers.get("x-forwarded-proto") ||
    (request.url.startsWith("https://") ? "https" : "http");

  if (host) {
    return `${protocol}://${host}`;
  }

  // Final fallback to localhost (for development)
  return "http://localhost:3000";
}
