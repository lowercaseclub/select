/**
 * URL Normalizer Utility
 * Normalizes social media URLs from various input formats to standard URLs
 */

interface SocialPlatform {
  name: string;
  baseUrl: string;
  patterns: RegExp[];
  normalizer: (input: string) => string;
}

/**
 * Extracts username from various LinkedIn URL formats
 */
function extractLinkedInUsername(input: string): string {
  // Handle various LinkedIn patterns
  const patterns = [
    // Full URLs
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([^\/\?&#]+)/i,
    // Partial paths with /in/
    /^\/in\/([^\/\?&#]+)/i,
    // Partial paths with in/
    /^in\/([^\/\?&#]+)/i,
    // Just the username part
    /^([a-zA-Z0-9-]+)$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If no pattern matches, assume it's just a username
  return input.replace(/[^a-zA-Z0-9-]/g, "");
}

/**
 * Extracts username from various GitHub URL formats
 */
function extractGitHubUsername(input: string): string {
  // Handle various GitHub patterns
  const patterns = [
    // Full URLs
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\?&#]+)/i,
    // Just the username part
    /^([a-zA-Z0-9-]+)$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If no pattern matches, assume it's just a username
  return input.replace(/[^a-zA-Z0-9-]/g, "");
}

/**
 * Extracts username from various Twitter URL formats
 */
function extractTwitterUsername(input: string): string {
  // Handle various Twitter patterns
  const patterns = [
    // Full URLs (twitter.com or x.com)
    /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([^\/\?&#]+)/i,
    // Handle @ mentions
    /^@([a-zA-Z0-9_]+)$/,
    // Just the username part
    /^([a-zA-Z0-9_]+)$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If no pattern matches, assume it's just a username
  return input.replace(/[^a-zA-Z0-9_]/g, "");
}

/**
 * Social media platform configurations
 */
const socialPlatforms: Record<string, SocialPlatform> = {
  linkedin: {
    name: "LinkedIn",
    baseUrl: "https://www.linkedin.com/in/",
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([^\/\?&#]+)/i,
      /^\/in\/([^\/\?&#]+)/i,
      /^in\/([^\/\?&#]+)/i,
      /^([a-zA-Z0-9-]+)$/,
    ],
    normalizer: (input: string) => {
      const username = extractLinkedInUsername(input);
      return `https://www.linkedin.com/in/${username}`;
    },
  },
  github: {
    name: "GitHub",
    baseUrl: "https://github.com/",
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\?&#]+)/i,
      /^([a-zA-Z0-9-]+)$/,
    ],
    normalizer: (input: string) => {
      const username = extractGitHubUsername(input);
      return `https://github.com/${username}`;
    },
  },
  twitter: {
    name: "Twitter",
    baseUrl: "https://twitter.com/",
    patterns: [
      /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([^\/\?&#]+)/i,
      /^@([a-zA-Z0-9_]+)$/,
      /^([a-zA-Z0-9_]+)$/,
    ],
    normalizer: (input: string) => {
      const username = extractTwitterUsername(input);
      return `https://twitter.com/${username}`;
    },
  },
};

/**
 * Normalizes a social media URL based on the platform
 * @param platform - The social media platform (linkedin, github, twitter)
 * @param input - The user input (can be username, partial URL, or full URL)
 * @returns Normalized full URL or empty string if input is empty
 */
export function normalizeSocialUrl(
  platform: keyof typeof socialPlatforms,
  input: string
): string {
  // Return empty string for empty input
  if (!input || input.trim() === "") {
    return "";
  }

  const trimmedInput = input.trim();
  const platformConfig = socialPlatforms[platform];

  if (!platformConfig) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  // If input is already a valid full URL for this platform, clean it up
  try {
    const url = new URL(
      trimmedInput.startsWith("http") ? trimmedInput : `https://${trimmedInput}`
    );
    if (platform === "linkedin" && url.hostname.includes("linkedin.com")) {
      return platformConfig.normalizer(trimmedInput);
    }
    if (platform === "github" && url.hostname.includes("github.com")) {
      return platformConfig.normalizer(trimmedInput);
    }
    if (
      platform === "twitter" &&
      (url.hostname.includes("twitter.com") || url.hostname.includes("x.com"))
    ) {
      return platformConfig.normalizer(trimmedInput);
    }
  } catch {
    // Not a valid URL, treat as username
  }

  // Normalize using platform-specific logic
  return platformConfig.normalizer(trimmedInput);
}

/**
 * Normalizes all social media URLs in form data
 * @param data - Form data containing social media fields
 * @returns Object with normalized URLs
 */
export function normalizeAllSocialUrls<T extends Record<string, unknown>>(
  data: T
): T {
  const normalized = { ...data };

  // Normalize each social media field if it exists
  if ("linkedin" in normalized && typeof normalized.linkedin === "string") {
    normalized.linkedin = normalizeSocialUrl("linkedin", normalized.linkedin);
  }

  if ("github" in normalized && typeof normalized.github === "string") {
    normalized.github = normalizeSocialUrl("github", normalized.github);
  }

  if ("twitter" in normalized && typeof normalized.twitter === "string") {
    normalized.twitter = normalizeSocialUrl("twitter", normalized.twitter);
  }

  return normalized;
}

/**
 * Validates that a normalized URL is actually valid
 * @param url - The URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === "") {
    return true; // Empty URLs are valid (optional fields)
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
