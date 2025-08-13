import { NextRequest, NextResponse } from "next/server";
import { CustomerioClient } from "@/lib/customerio";
import { getBizzaboClient } from "@/lib/bizzabo-api";
import { validateCSRFToken, extractCSRFTokenFromHeader } from "@/lib/csrf";
import {
  validateRequestHeaders,
  sanitizeInput,
  validateEmail,
  validateURL,
  isSuspiciousRequest,
} from "@/lib/security";

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Additional security checks
    if (isSuspiciousRequest(request)) {
      return NextResponse.json(
        { error: "Request blocked for security reasons" },
        { status: 403 }
      );
    }

    if (!validateRequestHeaders(request)) {
      return NextResponse.json(
        { error: "Invalid request headers" },
        { status: 400 }
      );
    }

    // CSRF validation
    const csrfToken = extractCSRFTokenFromHeader(request);
    if (!csrfToken || !validateCSRFToken(csrfToken)) {
      console.log("Request blocked: CSRF token validation failed");
      console.log("CSRF Token present:", !!csrfToken);
      console.log(
        "CSRF Token valid:",
        csrfToken ? validateCSRFToken(csrfToken) : false
      );
      return NextResponse.json(
        { error: "Invalid or missing CSRF token" },
        { status: 403 }
      );
    }

    const body: ApplicationData = await request.json();

    // Sanitize and validate input
    const sanitizedData: ApplicationData = {
      firstName: sanitizeInput(body.firstName || ""),
      lastName: sanitizeInput(body.lastName || ""),
      email: sanitizeInput(body.email || ""),
      company: body.company ? sanitizeInput(body.company) : undefined,
      linkedin: body.linkedin ? sanitizeInput(body.linkedin) : undefined,
      github: body.github ? sanitizeInput(body.github) : undefined,
      twitter: body.twitter ? sanitizeInput(body.twitter) : undefined,
    };

    // Validation
    if (
      !sanitizedData.firstName ||
      !sanitizedData.lastName ||
      !sanitizedData.email
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Enhanced email validation
    if (!validateEmail(sanitizedData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Enhanced URL validation for social links
    const urlFields = ["linkedin", "github", "twitter"] as const;
    for (const field of urlFields) {
      if (sanitizedData[field] && sanitizedData[field]!.trim() !== "") {
        if (!validateURL(sanitizedData[field]!)) {
          return NextResponse.json(
            { error: `Invalid ${field} URL` },
            { status: 400 }
          );
        }
      }
    }

    // Generate application ID once, use across all destinations
    const applicationId = `app_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // 1. Save to Supabase (skip for now)

    // 2. Save to Customer.io
    // Get environment variables
    const customerioSiteId = process.env.CUSTOMERIO_SITE_ID;
    const customerioApiKey = process.env.CUSTOMERIO_API_KEY;

    if (!customerioSiteId || !customerioApiKey) {
      console.warn(
        "Customer.io credentials not found, skipping Customer.io integration"
      );
    } else {
      try {
        const customerioClient = new CustomerioClient(
          customerioSiteId,
          customerioApiKey
        );

        // Get Bizzabo event information for consistency with the sync tool
        let eventInfo = null;
        try {
          const bizzaboClient = getBizzaboClient();
          eventInfo = await bizzaboClient.getEvent();
        } catch (error) {
          console.warn("Failed to fetch Bizzabo event info:", error);
        }

        // Create or update profile in Customer.io
        await customerioClient.createOrUpdateProfile(sanitizedData.email, {
          firstName: sanitizedData.firstName,
          lastName: sanitizedData.lastName,
          company: sanitizedData.company,
          linkedin: sanitizedData.linkedin,
          github: sanitizedData.github,
          twitter: sanitizedData.twitter,
        });

        // Track the event_applied event with Bizzabo event data
        const customerioEvent = {
          userId: sanitizedData.email,
          type: "track" as const,
          event: "Event Applied",
          properties: {
            event_id: eventInfo?.id || "supabase_select_2025",
            event_name: eventInfo?.name || "Supabase Select 2025",
            event_type: "event_applied",
            bizzabo_customer_id: null, // Not available from application form
            source: "Select 2025 Application Form",
            application_id: applicationId,
            company: sanitizedData.company,
            linkedin: sanitizedData.linkedin,
            github: sanitizedData.github,
            twitter: sanitizedData.twitter,
            submitted_at: new Date().toISOString(),
          },
          timestamp: customerioClient.isoToUnixTimestamp(
            new Date().toISOString()
          ),
        };

        await customerioClient.trackEvent(sanitizedData.email, customerioEvent);
      } catch (error) {
        console.error("Customer.io integration failed:", error);
        // Don't fail the entire request if Customer.io fails
      }
    }

    // 3. Save to Bizzabo (this is not possible, so skip for now)

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        applicationId: applicationId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
