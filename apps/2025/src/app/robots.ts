import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/", // Disallow API routes
        "/application-verified/", // Private application confirmation page
      ],
    },
  };
}
