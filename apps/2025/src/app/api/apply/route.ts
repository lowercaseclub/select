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
    const body: ApplicationData = await request.json();

    // Log the application data to console
    console.log("=== APPLICATION SUBMISSION ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Application Data:", JSON.stringify(body, null, 2));
    console.log("================================");

    // TODO: Add validation here
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Add email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // TODO: Add URL validation for social links
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

    // TODO: Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify admins
    // 4. Add to mailing list, etc.

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        applicationId: `app_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
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
