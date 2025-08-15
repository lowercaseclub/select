import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createContact } from "@/lib/bizzabo-api";
import {
  CustomerioAppClient,
  CustomerioTrackClient,
} from "@/lib/customerio";
import { rateCustomer, CustomerRating } from "@/lib/rate-customer";
import { getEvent } from "@/lib/bizzabo-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Initialize Supabase client
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

    // Find the temporary application by token
    const { data: tempApplication, error: findError } = await supabase
      .from("applications_select25_tmp")
      .select("*")
      .eq("verification_token", token)
      .single();

    if (findError || !tempApplication) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > new Date(tempApplication.expires_at)) {
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (tempApplication.verified_at) {
      return NextResponse.json(
        { error: "Application has already been verified" },
        { status: 400 }
      );
    }

    // Mark as verified
    const { error: verifyError } = await supabase
      .from("applications_select25_tmp")
      .update({ verified_at: new Date().toISOString() })
      .eq("verification_token", token);

    if (verifyError) {
      console.error("Error marking application as verified:", verifyError);
      return NextResponse.json(
        { error: "Failed to verify application" },
        { status: 500 }
      );
    }

    // Generate application ID
    const applicationId = `app_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // 1. Get customer rating from Customer.io App API
    const customerioAppApiKey = process.env.CUSTOMERIO_APP_API_KEY;
    let customerRating: CustomerRating | null = null;

    if (customerioAppApiKey) {
      try {
        const customerioAppClient = new CustomerioAppClient(
          customerioAppApiKey
        );
        const customerSegments = await customerioAppClient.getCustomerSegments(
          tempApplication.email
        );

        if (customerSegments.length > 0) {
          customerRating = rateCustomer(customerSegments);
          console.log("Customer rating:", customerRating);
        }
      } catch (error) {
        console.error("Failed to get customer rating:", error);
      }
    }

    // 2. Save to main applications table
    const applicationData = {
      first_name: tempApplication.first_name,
      last_name: tempApplication.last_name,
      email: tempApplication.email,
      company: tempApplication.company,
      linkedin: tempApplication.linkedin,
      github: tempApplication.github,
      twitter: tempApplication.twitter,
      initial_rating: customerRating
        ? {
            score: customerRating.score,
            tier: customerRating.tier,
            factors: customerRating.factors,
          }
        : null,
    };

    // Check if application already exists in main table
    const { data: existingData } = await supabase
      .from("applications_select25")
      .select("*")
      .eq("email", tempApplication.email)
      .single();

    let data, error;

    if (existingData) {
      // Update existing application
      console.log(
        "Updating existing application for email:",
        tempApplication.email
      );
      const { data: updateData, error: updateError } = await supabase
        .from("applications_select25")
        .update(applicationData)
        .eq("email", tempApplication.email)
        .select()
        .single();
      data = updateData;
      error = updateError;
    } else {
      // Insert new application
      console.log("Creating new application for email:", tempApplication.email);
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

    // 3. Save to Customer.io Track API (if enabled)
    const customerioSiteId = process.env.CUSTOMERIO_SITE_ID;
    const customerioApiKey = process.env.CUSTOMERIO_API_KEY;

    if (customerioSiteId && customerioApiKey) {
      try {
        const customerioClient = new CustomerioTrackClient(
          customerioSiteId,
          customerioApiKey
        );

        // Get Bizzabo event information
        let eventInfo = null;
        try {
          eventInfo = await getEvent();
        } catch (error) {
          console.warn("Failed to fetch Bizzabo event info:", error);
        }

        // Create or update profile in Customer.io
        await customerioClient.createOrUpdateProfile(tempApplication.email, {
          firstName: tempApplication.first_name,
          lastName: tempApplication.last_name,
          company: tempApplication.company,
          linkedin: tempApplication.linkedin,
          github: tempApplication.github,
          twitter: tempApplication.twitter,
        });

        // Track the event_applied event
        const customerioEvent = {
          userId: tempApplication.email,
          type: "track" as const,
          event: "Event Applied",
          properties: {
            event_id: eventInfo?.id || "supabase_select_2025",
            event_name: eventInfo?.name || "Supabase Select 2025",
            event_type: "event_applied",
            bizzabo_customer_id: null,
            source: "Select 2025 Application Form",
            application_id: applicationId,
            company: tempApplication.company,
            linkedin: tempApplication.linkedin,
            github: tempApplication.github,
            twitter: tempApplication.twitter,
            submitted_at: new Date().toISOString(),
          },
          timestamp: customerioClient.isoToUnixTimestamp(
            new Date().toISOString()
          ),
        };

        await customerioClient.trackEvent(
          tempApplication.email,
          customerioEvent
        );
        console.log("Customer.io Track API integration completed");
      } catch (error) {
        console.error("Customer.io Track API integration failed:", error);
      }
    }

    // 4. Save to Bizzabo
    try {
      const bizzaboContact = {
        email: tempApplication.email,
        firstName: tempApplication.first_name,
        lastName: tempApplication.last_name,
        company: tempApplication.company,
        linkedin: tempApplication.linkedin,
        github: tempApplication.github,
        twitter: tempApplication.twitter,
      };

      const bizzaboResponse = await createContact(bizzaboContact);
      console.log("Contact created in Bizzabo:", bizzaboResponse);
    } catch (error) {
      console.error("Bizzabo contact creation failed:", error);
    }

    // 5. Send confirmation email
    if (customerioAppApiKey) {
      try {
        const emailRequest = {
          transactional_message_id: 2, // Different template for confirmation
          to: tempApplication.email,
          identifiers: {
            email: tempApplication.email,
          },
          message_data: {
            firstName: tempApplication.first_name,
            lastName: tempApplication.last_name,
            fullName: `${tempApplication.first_name} ${tempApplication.last_name}`,
            company: tempApplication.company || "Not specified",
            linkedin: tempApplication.linkedin || "Not provided",
            github: tempApplication.github || "Not provided",
            twitter: tempApplication.twitter || "Not provided",
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

        const customerioAppClient = new CustomerioAppClient(
          customerioAppApiKey
        );
        const emailResponse = await customerioAppClient.sendTransactionalEmail(
          emailRequest
        );
        console.log("Confirmation email sent successfully:", emailResponse);
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
      }
    }

    // 6. Clean up temporary application (optional - keep for audit)
    // await supabase
    //   .from("applications_select25_tmp")
    //   .delete()
    //   .eq("verification_token", token);

    // Redirect to success page
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/application-verified?email=${encodeURIComponent(tempApplication.email)}`
    );
  } catch (error) {
    console.error("Error processing verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
