import { extractCSRFTokenFromHeader, validateCSRFToken } from "@/lib/csrf";
import { CustomerioAppClient, CustomerioSegment } from "@/lib/customerio";
import { CustomerRating, rateCustomer } from "@/lib/rate-customer";
import {
  isSuspiciousRequest,
  sanitizeInput,
  validateEmail,
  validateRequestHeaders,
  validateURL,
} from "@/lib/security";
import { getBaseUrl } from "@/lib/url-utils";
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
    console.log("CSRF Token present:", !!csrfToken);
    console.log(
      "CSRF Token value:",
      csrfToken ? csrfToken.substring(0, 20) + "..." : "None"
    );
    console.log(
      "CSRF Token valid:",
      csrfToken ? validateCSRFToken(csrfToken) : false
    );

    if (!csrfToken || !validateCSRFToken(csrfToken)) {
      console.log("Request blocked: CSRF token validation failed");
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

    // 2. Save to temporary table and send verification email
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

      // Check if temporary application already exists
      const { data: existingTempData, error: selectError } = await supabase
        .from("applications_select25_tmp")
        .select("*")
        .eq("email", sanitizedData.email)
        .single();

      if (selectError && selectError.code !== "PGRST116") {
        console.error(
          "Error checking for existing temp application:",
          selectError
        );
        return NextResponse.json(
          { error: "Failed to check for existing application" },
          { status: 500 }
        );
      }

      const tempApplicationData = {
        first_name: sanitizedData.firstName,
        last_name: sanitizedData.lastName,
        email: sanitizedData.email,
        company: sanitizedData.company,
        linkedin: sanitizedData.linkedin,
        github: sanitizedData.github,
        twitter: sanitizedData.twitter,
      };

      let tempData, tempError;

      if (existingTempData) {
        // Update existing temporary application
        console.log(
          "Updating existing temporary application for email:",
          sanitizedData.email
        );
        const { data: updateData, error: updateError } = await supabase
          .from("applications_select25_tmp")
          .update({
            ...tempApplicationData,
            verification_token: crypto.randomUUID(),
            expires_at: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(), // 24 hours
            verified_at: null,
          })
          .eq("email", sanitizedData.email)
          .select()
          .single();
        tempData = updateData;
        tempError = updateError;
      } else {
        // Insert new temporary application
        console.log(
          "Creating new temporary application for email:",
          sanitizedData.email
        );
        const { data: insertData, error: insertError } = await supabase
          .from("applications_select25_tmp")
          .insert(tempApplicationData)
          .select()
          .single();
        tempData = insertData;
        tempError = insertError;
      }

      if (tempError) {
        console.error("Supabase temp insert error:", tempError);
        return NextResponse.json(
          { error: "Failed to save application to database" },
          { status: 500 }
        );
      }

      console.log("Temporary application saved to Supabase:", tempData);

      // Send verification email
      if (customerioAppApiKey) {
        try {
          const verificationUrl = `${getBaseUrl(request)}/api/verify?token=${
            tempData.verification_token
          }`;

          const emailRequest = {
            transactional_message_id: 3, // Verification email template
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
              verificationUrl: verificationUrl,
              expiresAt: new Date(tempData.expires_at).toLocaleString(),
            },
          };

          const emailResponse =
            await customerioAppClient.sendTransactionalEmail(emailRequest);
          console.log("Verification email sent successfully:", emailResponse);
        } catch (error) {
          console.error("Failed to send verification email:", error);
          return NextResponse.json(
            { error: "Failed to send verification email" },
            { status: 500 }
          );
        }
      } else {
        console.warn(
          "Customer.io App API key not available, skipping verification email"
        );
      }
    } catch (error) {
      console.error("Supabase integration failed:", error);
      return NextResponse.json(
        { error: "Failed to save application to database" },
        { status: 500 }
      );
    }

    // Note: Full integration (Customer.io Track API, Bizzabo, confirmation email)
    // will be completed after email verification in /api/verify

    return NextResponse.json(
      {
        success: true,
        message:
          "Application submitted successfully! Please check your email to verify your application.",
        applicationId: applicationId,
        requiresVerification: true,
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
