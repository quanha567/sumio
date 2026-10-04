import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Input, Checkbox } from "@/components/ui";

import { useAuth } from "../context/auth-context";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";

export function LoginForm() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      await signInWithEmail(data.email, data.password);
      void navigate({ to: "/" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to sign in. Please verify your credentials.";
      if (
        msg.includes("user-not-found") ||
        msg.includes("wrong-password") ||
        msg.includes("invalid-credential")
      ) {
        setAuthError("Incorrect email or password. Please check and try again.");
      } else {
        setAuthError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSubmitting(true);
      setAuthError(null);
      await signInWithGoogle();
      void navigate({ to: "/" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Google sign-in was cancelled or encountered an error.";
      if (!msg.includes("popup-closed-by-user")) {
        setAuthError(msg);
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-[26px]">
          Welcome back!{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
        </h2>
        <p className="text-muted mt-1.5 text-sm">Sign in to continue your financial journey.</p>
      </div>

      {/* Global Auth Error Alert */}
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-foreground block text-xs font-medium sm:text-sm">Password</label>
          <div className="relative">
            <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-11 w-full pr-10 pl-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted hover:text-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-danger text-xs">{errors.password.message}</p>}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between pt-1">
          <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs select-none sm:text-sm">
            <Checkbox
              isSelected={rememberMe}
              onValueChange={(checked: boolean) => setValue("rememberMe", checked)}
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-accent text-xs font-medium transition-colors hover:underline sm:text-sm"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isGoogleSubmitting}
          className="bg-accent text-accent-foreground shadow-accent/20 mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold shadow-md transition-transform hover:opacity-95 active:scale-[0.99]"
        >
          <span>{isSubmitting ? "Signing in..." : "Sign in"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-border w-full border-t" />
        <span className="text-muted absolute bg-white/95 px-3 text-xs font-medium tracking-wider uppercase">
          or
        </span>
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting || isGoogleSubmitting}
        onClick={() => void handleGoogleSignIn()}
        className="border-border text-foreground hover:bg-surface-secondary flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border bg-white shadow-xs transition-all active:scale-[0.99]"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.25 21.36 7.34 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32 0-.83.13-1.6.38-2.32V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.09z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
          />
        </svg>
        <span className="text-sm font-medium">
          {isGoogleSubmitting ? "Connecting..." : "Continue with Google"}
        </span>
      </Button>

      {/* Switch to Register */}
      <p className="text-muted text-center text-xs sm:text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-accent font-semibold transition-colors hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
