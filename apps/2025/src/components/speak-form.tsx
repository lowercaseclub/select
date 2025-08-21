"use client";

import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  CodeBracketIcon as GitHubIcon,
  UserIcon as LinkedInIcon,
} from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Textarea } from "@ui/components/textarea";
import { Separator } from "@ui/components/separator";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { normalizeSocialUrl, isValidUrl } from "../lib/url-normalizer";

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

type SpeakFormData = z.infer<typeof speakFormSchema>;

const iconClasses =
  "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground";

export function SpeakForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SpeakFormData>({
    resolver: zodResolver(speakFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      city: "",
      country: "",
      linkedin: "",
      github: "",
      talkDescription: "",
      interestedFutureEvents: false,
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: SpeakFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1: Normalize social media URLs (only LinkedIn and GitHub for speak form)
      const normalizedData = {
        ...data,
        linkedin: data.linkedin
          ? normalizeSocialUrl("linkedin", data.linkedin)
          : "",
        github: data.github ? normalizeSocialUrl("github", data.github) : "",
      };

      // Step 2: Update form with normalized values (this will show the corrected URLs)
      form.setValue("linkedin", normalizedData.linkedin || "");
      form.setValue("github", normalizedData.github || "");

      // Step 3: Validate normalized URLs
      if (!isValidUrl(normalizedData.linkedin)) {
        throw new Error("Invalid LinkedIn URL");
      }
      if (!isValidUrl(normalizedData.github)) {
        throw new Error("Invalid GitHub URL");
      }

      // Submit to API endpoint
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      // Show success state
      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting speak form:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Error submitting application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-card border rounded-lg p-8 text-center">
        <p className="text-base md:text-lg">
          Your speaking proposal was submitted. We will review all submissions
          and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Speaking Application</h2>
        <p className="text-muted-foreground">
          Tell us about yourself and your proposed talk.
        </p>
      </div>

      {false && submitError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full md:flex-1">
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your first name"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full md:flex-1">
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your last name"
                      autoComplete="family-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <EnvelopeIcon className={iconClasses} />
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      autoComplete="email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <BuildingOfficeIcon className={iconClasses} />
                    <Input
                      placeholder="Your company name"
                      className="pl-10"
                      autoComplete="organization"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full md:flex-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your city"
                      autoComplete="address-level2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-full md:flex-1">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your country"
                      autoComplete="country-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Professional Links</h3>

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LinkedInIcon className={iconClasses} />
                      <Input
                        type="text"
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Profile *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <GitHubIcon className={iconClasses} />
                      <Input
                        type="text"
                        placeholder="https://github.com/yourusername"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <FormField
            control={form.control}
            name="talkDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe your talk *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide a detailed description of your proposed talk, including the main topics, key takeaways, and why it would be valuable for our audience of database developers and builders..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="interestedFutureEvents"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <input
                    id="interestedFutureEvents"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border bg-background"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <Label
                    htmlFor="interestedFutureEvents"
                    className="font-normal"
                  >
                    If my talk is not chosen for Supabase Select, I&apos;d be
                    interested in future Supabase events
                  </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {submitError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Submit Speaking Application
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
