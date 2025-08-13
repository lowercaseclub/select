import { NextRequest, NextResponse } from "next/server";
import { CustomerioClient } from "@/lib/customerio";
import { getBizzaboClient } from "@/lib/bizzabo-api";

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
    const body: ApplicationData = await request.json();

    // Validation
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // URL validation for social links
    const urlFields = ["linkedin", "github", "twitter"] as const;
    for (const field of urlFields) {
      if (body[field] && body[field]!.trim() !== "") {
        try {
          new URL(body[field]!);
        } catch {
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
        await customerioClient.createOrUpdateProfile(body.email, {
          firstName: body.firstName,
          lastName: body.lastName,
          company: body.company,
          linkedin: body.linkedin,
          github: body.github,
          twitter: body.twitter,
        });

        // Track the event_applied event with Bizzabo event data
        const customerioEvent = {
          userId: body.email,
          type: "track" as const,
          event: "Event Applied",
          properties: {
            event_id: eventInfo?.id || "supabase_select_2025",
            event_name: eventInfo?.name || "Supabase Select 2025",
            event_type: "event_applied",
            bizzabo_customer_id: null, // Not available from application form
            source: "Select 2025 Application Form",
            application_id: applicationId,
            company: body.company,
            linkedin: body.linkedin,
            github: body.github,
            twitter: body.twitter,
            submitted_at: new Date().toISOString(),
          },
          timestamp: customerioClient.isoToUnixTimestamp(
            new Date().toISOString()
          ),
        };

        await customerioClient.trackEvent(body.email, customerioEvent);
        console.log("Customer.io event tracked successfully:", customerioEvent);
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
