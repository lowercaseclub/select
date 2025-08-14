"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const ticketRequestSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("Please enter a valid Twitter URL")
    .optional()
    .or(z.literal("")),
  reason: z
    .string()
    .min(
      10,
      "Please provide at least 10 characters explaining why you'd like to attend"
    ),
});

export interface ActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Server-side form action (no state)
export async function submitTicketRequestForm(formData: FormData): Promise<void> {
  try {
    // Extract form data
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      jobTitle: formData.get("jobTitle") as string,
      linkedinUrl: formData.get("linkedinUrl") as string,
      twitterUrl: formData.get("twitterUrl") as string,
      reason: formData.get("reason") as string,
    };

    // Validate the data
    const validatedData = ticketRequestSchema.parse(rawData);

    // TODO: Integrate with your backend API (Bizzabo, database, email service, etc.)
    console.log("Ticket request submitted:", validatedData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to success page or back with success message
    redirect("/?success=ticket-submitted");
  } catch (error) {
    if (error instanceof z.ZodError) {
      // For server-side forms, we can redirect with error query params
      // or handle errors differently based on your needs
      console.error("Validation errors:", error.issues);
      redirect("/?error=validation-failed");
    }

    console.error("Failed to submit ticket request:", error);
    redirect("/?error=submission-failed");
  }
}

// Client-side form action (with state) - kept for reference
export async function submitTicketRequest(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract form data
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      jobTitle: formData.get("jobTitle") as string,
      linkedinUrl: formData.get("linkedinUrl") as string,
      twitterUrl: formData.get("twitterUrl") as string,
      reason: formData.get("reason") as string,
    };

    // Validate the data
    const validatedData = ticketRequestSchema.parse(rawData);

    // TODO: Integrate with your backend API (Bizzabo, database, email service, etc.)
    // For now, we'll simulate the API call
    console.log("Ticket request submitted:", validatedData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with actual API integration
    // Example integrations:
    // - Send to Bizzabo API
    // - Save to database
    // - Send email notification
    // - Add to mailing list

    return {
      success: true,
      message:
        "Thank you! Your ticket request has been submitted successfully. We'll be in touch soon.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      const errors: Record<string, string[]> = {};
      error.issues.forEach((err: z.ZodIssue) => {
        if (err.path) {
          const field = err.path[0] as string;
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        }
      });

      return {
        success: false,
        message: "Please check the form for errors.",
        errors,
      };
    }

    console.error("Failed to submit ticket request:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
