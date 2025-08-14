import { NextRequest } from "next/server";

// Additional security validations
export function validateRequestHeaders(request: NextRequest): boolean {
  // Check for required headers that indicate a legitimate browser request
  const userAgent = request.headers.get("user-agent");
  const accept = request.headers.get("accept");
  void accept; // Acknowledge unused variable

  // Basic checks for browser-like requests
  if (!userAgent || userAgent.length < 5) {
    return false;
  }

  // More lenient accept header check - allow any accept header or none
  // Most browsers will send some accept header, but we don't want to be too strict
  return true;
}

export function sanitizeInput(input: string): string {
  // Basic input sanitization
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export function validateEmail(email: string): boolean {
  // More comprehensive email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return false;
    }
    // Check for reasonable length
    if (url.length > 2048) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function isSuspiciousRequest(request: NextRequest): boolean {
  // Check for suspicious patterns
  const userAgent = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";

  // Block only obvious bot user agents (more lenient)
  const obviousBotPatterns = [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "curl",
    "wget",
    "python-requests",
    "postman",
    "insomnia",
    "thunder client",
  ];

  const isObviousBot = obviousBotPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern)
  );

  if (isObviousBot) {
    return true;
  }

  // Don't block localhost/development environments
  // Only block if it's clearly a suspicious external referer
  if (referer) {
    const suspiciousExternalPatterns = [
      "malicious.com",
      "spam.com",
      "attack.com",
    ];

    const hasSuspiciousExternalReferer = suspiciousExternalPatterns.some(
      (pattern) => referer.toLowerCase().includes(pattern)
    );

    if (hasSuspiciousExternalReferer) {
      return true;
    }
  }

  return false;
}
