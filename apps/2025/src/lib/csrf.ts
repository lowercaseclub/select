import { randomBytes, createHmac } from "crypto";

// CSRF token configuration
const CSRF_SECRET =
  process.env.CSRF_SECRET || "your-csrf-secret-key-change-in-production";

// Log CSRF secret status (without exposing the actual secret)
console.log("CSRF_SECRET configured:", !!process.env.CSRF_SECRET);
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export interface CSRFToken {
  token: string;
  expiresAt: number;
}

export function generateCSRFToken(): CSRFToken {
  const randomToken = randomBytes(32).toString("hex");
  const timestamp = Date.now();
  const expiresAt = timestamp + CSRF_TOKEN_EXPIRY;

  // Create a signature to prevent tampering
  const signature = createHmac("sha256", CSRF_SECRET)
    .update(`${randomToken}:${timestamp}`)
    .digest("hex");

  const token = `${randomToken}.${timestamp}.${signature}`;

  return {
    token,
    expiresAt,
  };
}

export function validateCSRFToken(token: string): boolean {
  try {
    const [randomToken, timestamp, signature] = token.split(".");

    if (!randomToken || !timestamp || !signature) {
      return false;
    }

    const tokenTimestamp = parseInt(timestamp, 10);
    const now = Date.now();

    // Check if token has expired
    if (now > tokenTimestamp + CSRF_TOKEN_EXPIRY) {
      return false;
    }

    // Verify signature
    const expectedSignature = createHmac("sha256", CSRF_SECRET)
      .update(`${randomToken}:${timestamp}`)
      .digest("hex");

    return signature === expectedSignature;
  } catch {
    return false;
  }
}

export function extractCSRFTokenFromHeader(request: Request): string | null {
  // Try multiple header names for better compatibility
  return (
    request.headers.get("x-csrf-token") ||
    request.headers.get("X-CSRF-Token") ||
    request.headers.get("csrf-token") ||
    null
  );
}
