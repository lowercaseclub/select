import { createContact, getEvent } from "@/lib/bizzabo-api";
import { extractCSRFTokenFromHeader, validateCSRFToken } from "@/lib/csrf";
import {
  CustomerioAppClient,
  CustomerioSegment,
  CustomerioTrackClient,
} from "@/lib/customerio";
import { CustomerRating, rateCustomer } from "@/lib/rate-customer";
import {
  isSuspiciousRequest,
  sanitizeInput,
  validateEmail,
  validateRequestHeaders,
  validateURL,
} from "@/lib/security";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

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

    // 1. Use Customer.io App API to get customer data and do an initial pass at rating the application
    const customerioAppApiKey = process.env.CUSTOMERIO_APP_API_KEY;

    if (!customerioAppApiKey) {
      console.warn("CUSTOMERIO_APP_API_KEY not found in environment variables");
    }

    const customerioAppClient = new CustomerioAppClient(
      customerioAppApiKey || ""
    );

    let customerSegments: CustomerioSegment[] = [];
    let customerRating: CustomerRating | null = null;

    if (customerioAppApiKey) {
      try {
        customerSegments = await customerioAppClient.getCustomerSegments(
          sanitizedData.email
        );
      } catch (error) {
        console.error("Failed to fetch customer segments:", error);
        // Continue processing even if Customer.io fails
      }
    }

    if (customerSegments.length === 0) {
      console.warn(
        "Customer.io profile not found or no segments, skipping Customer.io integration"
      );
    } else {
      // Rate the customer based on their segments
      customerRating = rateCustomer(customerSegments);
      console.log("Customer rating:", customerRating);
    }

    // Format of customerRating:
    // {
    //   score: 100,
    //   tier: "tier1",
    //   factors: ["Enterprise plan subscriber", "Current launch week signup", "2 Supabase services activated"]
    // }

    // 2. Save to Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Missing Supabase environment variables");
        return NextResponse.json(
          { error: "Database configuration error" },
          { status: 500 }
        );
      }

      const supabase = createServiceClient(supabaseUrl, supabaseServiceKey);

      // First, try to find existing application with this email
      const { data: existingData, error: selectError } = await supabase
        .from("applications_select25")
        .select("*")
        .eq("email", sanitizedData.email)
        .single();

      if (selectError && selectError.code !== "PGRST116") {
        console.error("Error checking for existing application:", selectError);
        return NextResponse.json(
          { error: "Failed to check for existing application" },
          { status: 500 }
        );
      }

      const applicationData = {
        first_name: sanitizedData.firstName,
        last_name: sanitizedData.lastName,
        email: sanitizedData.email,
        company: sanitizedData.company,
        linkedin: sanitizedData.linkedin,
        github: sanitizedData.github,
        twitter: sanitizedData.twitter,
        initial_rating: customerRating
          ? {
              score: customerRating.score,
              tier: customerRating.tier,
              factors: customerRating.factors,
            }
          : null,
      };

      let data, error;

      if (existingData) {
        // Update existing application
        console.log(
          "Updating existing application for email:",
          sanitizedData.email
        );
        const { data: updateData, error: updateError } = await supabase
          .from("applications_select25")
          .update(applicationData)
          .eq("email", sanitizedData.email)
          .select()
          .single();
        data = updateData;
        error = updateError;
      } else {
        // Insert new application
        console.log("Creating new application for email:", sanitizedData.email);
        const { data: insertData, error: insertError } = await supabase
          .from("applications_select25")
          .insert(applicationData)
          .select()
          .single();
        data = insertData;
        error = insertError;
      }

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: "Failed to save application to database" },
          { status: 500 }
        );
      }

      console.log("Application saved to Supabase:", data);
    } catch (error) {
      console.error("Supabase integration failed:", error);
      return NextResponse.json(
        { error: "Failed to save application to database" },
        { status: 500 }
      );
    }

    // 3. Save to Customer.io
    // Get environment variables
    const customerioSiteId = process.env.CUSTOMERIO_SITE_ID;
    const customerioApiKey = process.env.CUSTOMERIO_API_KEY;

    if (!customerioSiteId || !customerioApiKey) {
      console.warn(
        "Customer.io credentials not found, skipping Customer.io integration"
      );
    } else {
      try {
        const customerioClient = new CustomerioTrackClient(
          customerioSiteId,
          customerioApiKey
        );

        // Get Bizzabo event information for consistency with the sync tool
        let eventInfo = null;
        try {
          eventInfo = await getEvent();
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

    // 4. Save to Bizzabo
    try {
      const bizzaboContact = {
        email: sanitizedData.email,
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        company: sanitizedData.company,
        linkedin: sanitizedData.linkedin,
        github: sanitizedData.github,
        twitter: sanitizedData.twitter,
      };

      const bizzaboResponse = await createContact(bizzaboContact);
      console.log("Contact created in Bizzabo:", bizzaboResponse);
    } catch (error) {
      console.error("Bizzabo contact creation failed:", error);
      // Don't fail the entire request if Bizzabo fails
    }

    // 5. Send transactional email to the applicant
    if (customerioAppApiKey) {
      try {
        const emailRequest = {
          transactional_message_id: 2,
          to: sanitizedData.email,
          identifiers: {
            email: sanitizedData.email,
          },
          message_data: {
            firstName: sanitizedData.firstName,
            lastName: sanitizedData.lastName,
            fullName: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
            company: sanitizedData.company || "Not specified",
            linkedin: sanitizedData.linkedin || "Not provided",
            github: sanitizedData.github || "Not provided",
            twitter: sanitizedData.twitter || "Not provided",
            applicationId: applicationId,
            submittedAt: new Date().toISOString(),
            customerRating: customerRating
              ? {
                  score: customerRating.score,
                  tier: customerRating.tier,
                  factors: customerRating.factors,
                }
              : null,
          },
        };

        const emailResponse = await customerioAppClient.sendTransactionalEmail(
          emailRequest
        );
        console.log("Transactional email sent successfully:", emailResponse);
      } catch (error) {
        console.error("Failed to send transactional email:", error);
        // Don't fail the entire request if email sending fails
      }
    } else {
      console.warn(
        "Customer.io App API key not available, skipping transactional email"
      );
    }

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
