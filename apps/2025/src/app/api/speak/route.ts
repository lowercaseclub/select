import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { CustomerioTrackClient } from "@/lib/customerio";
import { getEvent } from "@/lib/bizzabo-api";

// Validation schema for the speak form
const speakFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  linkedin: z.string().min(1, "LinkedIn profile is required"),
  github: z.string().min(1, "GitHub profile is required"),
  talkDescription: z
    .string()
    .min(10, "Please provide a detailed description of your talk"),
  interestedFutureEvents: z.boolean().optional(),
});

// Type is used implicitly by the schema validation

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse and validate the request body
    const body = await request.json();
    const validatedData = speakFormSchema.parse(body);

    // Transform the data to match the database schema
    const speakerData = {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      email: validatedData.email,
      company: validatedData.company || null,
      city: validatedData.city || null,
      country: validatedData.country || null,
      linkedin_profile: validatedData.linkedin,
      github_profile: validatedData.github,
      talk_description: validatedData.talkDescription,
      interested_future_events: validatedData.interestedFutureEvents || false,
      source: "Select 2025",
    };

    // Insert the data into the events_speakers table
    const { data, error } = await supabase
      .from("events_speakers")
      .insert([speakerData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save application" },
        { status: 500 }
      );
    }

    // Fire Customer.io track event (non-blocking)
    try {
      const customerioSiteId = process.env.CUSTOMERIO_SITE_ID;
      const customerioApiKey = process.env.CUSTOMERIO_API_KEY;

      if (customerioSiteId && customerioApiKey) {
        const customerioClient = new CustomerioTrackClient(
          customerioSiteId,
          customerioApiKey
        );

        // Get event info if available (best-effort)
        let eventInfo: { id?: string | number; name?: string } | null = null;
        try {
          eventInfo = await getEvent();
        } catch (e) {
          console.warn("Failed to fetch Bizzabo event info:", e);
        }

        // Ensure profile exists / is updated
        await customerioClient.createOrUpdateProfile(validatedData.email, {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          company: validatedData.company,
          linkedin: validatedData.linkedin,
          github: validatedData.github,
          city: validatedData.city,
          country: validatedData.country,
        });

        const customerioEvent = {
          userId: validatedData.email,
          type: "track" as const,
          event: "Event Speaker Interest",
          properties: {
            event_id: eventInfo?.id || "supabase_select_2025",
            event_name: eventInfo?.name || "Supabase Select 2025",
            source: "Select 2025 Speak Form",
            application_id: data.id,
            company: validatedData.company,
            linkedin: validatedData.linkedin,
            github: validatedData.github,
            city: validatedData.city,
            country: validatedData.country,
            interested_future_events:
              validatedData.interestedFutureEvents ?? false,
            submitted_at: new Date().toISOString(),
          },
          timestamp: customerioClient.isoToUnixTimestamp(
            new Date().toISOString()
          ),
        };

        await customerioClient.trackEvent(validatedData.email, customerioEvent);
      } else {
        console.warn(
          "CUSTOMERIO_SITE_ID or CUSTOMERIO_API_KEY not configured; skipping Customer.io tracking"
        );
      }
    } catch (cioError) {
      console.error("Customer.io Track API integration failed:", cioError);
      // Do not fail the request due to tracking errors
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        id: data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid form data",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
