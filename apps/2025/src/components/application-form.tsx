"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Building,
  Linkedin,
  Github,
  Twitter,
  Send,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/dialog";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { useToast } from "@ui/hooks/use-toast";

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
  trigger?: React.ReactNode;
}

export function ApplicationForm({ trigger }: ApplicationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      // Validate URLs if provided
      const urlFields = ["linkedin", "github", "twitter"] as const;
      for (const field of urlFields) {
        if (data[field] && data[field]!.trim() !== "") {
          try {
            new URL(data[field]!);
          } catch {
            throw new Error(`Invalid ${field} URL`);
          }
        }
      }

      // Submit to API
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      // Close dialog and reset form
      setIsOpen(false);
      reset();

      // Show success toast
      toast({
        title: "Application Submitted",
        description:
          "Thank you for your submission. We will review all applications carefully and will inform you soon.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      // Show error toast
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error submitting application. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#2FAE75] border-2 border-[#3ECF8E] px-8 py-4 text-xl font-medium text-white hover:bg-[#3ECF8E] transition-colors rounded-none">
            Apply to Attend
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Apply to attend Supabase Select
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Because of space limitations, we must limit the number of attendees.
            Please fill out as much information as you can, and be sure to use
            the email address with which you have signed up for Supabase.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-foreground"
              >
                First Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className="pl-10"
                  placeholder="Enter your first name"
                />
              </div>
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-foreground"
              >
                Last Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className="pl-10"
                  placeholder="Enter your last name"
                />
              </div>
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="pl-10"
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="company"
              className="text-sm font-medium text-foreground"
            >
              Company Name
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                {...register("company")}
                className="pl-10"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">
              Social Links
            </Label>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label
                  htmlFor="linkedin"
                  className="text-sm text-muted-foreground"
                >
                  LinkedIn
                </Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    type="url"
                    {...register("linkedin")}
                    className="pl-10"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                {errors.linkedin && (
                  <p className="text-sm text-destructive">
                    {errors.linkedin.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="github"
                  className="text-sm text-muted-foreground"
                >
                  GitHub
                </Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="github"
                    type="url"
                    {...register("github")}
                    className="pl-10"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                {errors.github && (
                  <p className="text-sm text-destructive">
                    {errors.github.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="twitter"
                  className="text-sm text-muted-foreground"
                >
                  Twitter
                </Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitter"
                    type="url"
                    {...register("twitter")}
                    className="pl-10"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                {errors.twitter && (
                  <p className="text-sm text-destructive">
                    {errors.twitter.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2FAE75] border-2 border-[#3ECF8E] text-white hover:bg-[#3ECF8E] transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
