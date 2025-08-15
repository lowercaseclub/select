"use client";

import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  CodeBracketIcon as GitHubIcon,
  UserIcon as LinkedInIcon,
  ChatBubbleLeftRightIcon as TwitterIcon,
} from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@ui/components/alert-dialog";
import { Button } from "@ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ui/components/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { Separator } from "@ui/components/separator";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { normalizeAllSocialUrls, isValidUrl } from "../lib/url-normalizer";

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  trigger: React.ReactNode;
}

const iconClasses =
  "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground";

export function ApplicationForm({ trigger }: ApplicationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      linkedin: "",
      github: "",
      twitter: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  // Fetch CSRF token when dialog opens
  const fetchCSRFToken = async () => {
    try {
      console.log("Fetching CSRF token...");
      const response = await fetch("/api/csrf");
      console.log("CSRF response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("CSRF token received:", data.token ? "Yes" : "No");
        setCsrfToken(data.token);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch CSRF token:", errorData);
      }
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1: Normalize social media URLs
      const normalizedData = normalizeAllSocialUrls(data);

      // Step 2: Update form with normalized values (this will show the corrected URLs)
      form.setValue("linkedin", normalizedData.linkedin || "");
      form.setValue("github", normalizedData.github || "");
      form.setValue("twitter", normalizedData.twitter || "");

      // Step 3: Wait 2 seconds to show the user the corrections
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 4: Validate normalized URLs
      const urlFields = ["linkedin", "github", "twitter"] as const;
      for (const field of urlFields) {
        if (normalizedData[field] && normalizedData[field]!.trim() !== "") {
          if (!isValidUrl(normalizedData[field]!)) {
            throw new Error(`Invalid ${field} URL: ${normalizedData[field]}`);
          }
        }
      }

      // Check if we have a CSRF token
      if (!csrfToken) {
        throw new Error("CSRF token not available. Please try again.");
      }

      // Submit to API
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(normalizedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      // Show success state
      setIsSubmitted(true);
      setShowConfirmation(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Error submitting application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
    setIsSubmitted(false);
    setShowConfirmation(false);
    setSubmitError(null);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setIsOpen(false);
    form.reset();
    setIsSubmitted(false);
    setSubmitError(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Fetch CSRF token when dialog opens
      fetchCSRFToken();
    } else {
      // Clear CSRF token when dialog closes
      setCsrfToken(null);
      setIsSubmitted(false);
      setShowConfirmation(false);
      setSubmitError(null);
    }
  };

  // Shared header content
  const headerContent = {
    title: "Apply to attend Supabase Select",
    description:
      "Because of space limitations, we must limit the number of attendees. Please fill out as much information as you can, and be sure to use the email address with which you have signed up for Supabase.",
  };

  // Shared form content component
  const FormContent = ({ isMobileDrawer = false }) => (
    <>
      <div className="flex flex-col gap-6">
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            name="application-form"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full md:flex-1">
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input
                        key="firstName-input"
                        placeholder="Enter your first name"
                        autoFocus={!isMobile}
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
                      <div className="relative ">
                        <Input
                          placeholder="Enter your last name"
                          autoComplete="family-name"
                          {...field}
                        />
                      </div>
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
                        placeholder="Enter your email address"
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
                    <div className="relative mt-1">
                      <BuildingOfficeIcon className={iconClasses} />
                      <Input
                        placeholder="Enter your company name"
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

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Social Links</h3>

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <div className="relative mt-1">
                          <LinkedInIcon className={iconClasses} />
                          <Input
                            type="text"
                            placeholder="yourprofilename"
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
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <div className="relative mt-1">
                          <GitHubIcon className={iconClasses} />
                          <Input
                            type="text"
                            placeholder="@yourusername"
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
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <div className="relative mt-1">
                          <TwitterIcon className={iconClasses} />
                          <Input
                            type="text"
                            placeholder="@yourhandle"
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
            </div>

            {!isSubmitted && !isMobileDrawer && (
              <div className="flex flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="border-border text-foreground hover:bg-muted flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={isOpen} onOpenChange={handleOpenChange}>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent
            className={`flex flex-col max-h-[80vh] transition-transform duration-300 ${
              showConfirmation ? "scale-95 opacity-50" : ""
            }`}
          >
            <div className="overflow-y-auto flex-1 px-6">
              <DrawerHeader className="px-0">
                <DrawerTitle>{headerContent.title}</DrawerTitle>
                <DrawerDescription className="text-muted-foreground">
                  {headerContent.description}
                </DrawerDescription>
              </DrawerHeader>
              <Separator className="my-4" />
              <div className="px-0 pb-20">
                <FormContent isMobileDrawer={true} />
              </div>
            </div>
            {!isSubmitted && (
              <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="border-border text-foreground hover:bg-muted flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            )}
          </DrawerContent>
        </Drawer>

        {/* Mobile Confirmation Drawer Overlay */}
        <Drawer open={showConfirmation} onOpenChange={() => {}}>
          <DrawerContent className="z-[60]">
            <div className="flex flex-col items-center gap-6 py-8 px-6">
              <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold">
                  Application Submitted!
                </h3>
                <p className="text-muted-foreground">
                  Thank you for your submission. Please check your email for a
                  confirmation link to complete your application.
                </p>
              </div>
              <Button
                onClick={handleConfirmationClose}
                className="w-full max-w-xs mt-4"
              >
                Got it, thanks!
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={`transition-all duration-300 ${
            showConfirmation ? "scale-95 opacity-50" : ""
          }`}
        >
          <DialogHeader>
            <DialogTitle className="">{headerContent.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {headerContent.description}
            </DialogDescription>
          </DialogHeader>
          <Separator className="my-4" />
          <FormContent isMobileDrawer={false} />
        </DialogContent>
      </Dialog>

      {/* Confirmation AlertDialog Overlay */}
      <AlertDialog open={showConfirmation} onOpenChange={() => {}}>
        <AlertDialogContent className="z-[60]">
          <AlertDialogTitle className="sr-only">
            Application Submitted
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Your application has been successfully submitted. Please check your
            email for confirmation.
          </AlertDialogDescription>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Application Submitted!</h3>
              <p className="text-muted-foreground">
                Thank you for your submission. Please check your email for a
                confirmation link to complete your application.
              </p>
            </div>
            <AlertDialogAction
              onClick={handleConfirmationClose}
              className="w-full max-w-xs"
            >
              Got it, thanks!
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
