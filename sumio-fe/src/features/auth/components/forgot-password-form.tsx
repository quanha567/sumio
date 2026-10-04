import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Input } from "@/components/ui";

import { useAuth } from "../context/auth-context";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../schemas/auth.schema";

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      await resetPassword(data.email);
      setSentEmail(data.email);
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset email.";
      if (msg.includes("user-not-found")) {
        setAuthError("No account found with this email address.");
      } else {
        setAuthError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-entrance space-y-6 text-center">
        <div className="bg-success/15 text-success mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">Check your inbox</h2>
          <p className="text-muted mt-2 text-sm">
            We have sent a password reset link to{" "}
            <span className="text-foreground font-semibold">{sentEmail}</span>. Please follow the
            instructions in the email.
          </p>
        </div>

        <Link to="/login" className="block w-full">
          <Button
            type="button"
            className="bg-accent text-accent-foreground shadow-accent/20 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold shadow-md hover:opacity-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to sign in</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-[26px]">
          Reset password 🔑
        </h2>
        <p className="text-muted mt-1.5 text-sm">
          Enter your registered email and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      {/* Global Error Alert */}
      {authError && (
        <div className="border-danger/20 bg-danger/10 text-danger animate-entrance rounded-xl border p-3 text-xs sm:text-sm">
          {authError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-foreground block text-xs font-medium sm:text-sm">
            Email address
          </label>
          <div className="relative">
            <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-11 w-full pl-10"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-danger text-xs">{errors.email.message}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent text-accent-foreground shadow-accent/20 mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold shadow-md transition-transform hover:opacity-95 active:scale-[0.99]"
        >
          <span>{isSubmitting ? "Sending reset link..." : "Send reset link"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Back to Login */}
      <div className="pt-2 text-center">
        <Link
          to="/login"
          className="text-muted hover:text-foreground inline-flex items-center gap-2 text-xs font-medium transition-colors sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Remember your password? Sign in</span>
        </Link>
      </div>
    </div>
  );
}
